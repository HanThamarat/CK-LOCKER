const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const redisClient = require('../config/redis');
const paginate = require('express-paginate');
const DecriptToeken = require('../hooks/decriptJwt');
const checkZoneActive = require('../hooks/checkZoneactive');

const prisma = new PrismaClient();

router.post('/createLocker', async (req, res) => {
    try {
        const { lockerName , floorQutity, limitdoc, LockerZone, colorCode, proType, typeQuetity } = await req.body;
        let newFloor;
        const UserZone = DecriptToeken(req).user.user_zone;
        
        const newLocker = await prisma.lockers.create({
            data: {
                LockerName: lockerName,
                FloorQutity: floorQutity,
                LockerZone: LockerZone,
                LockerColorCode: colorCode,
                ProtypeNo: proType,
            }
        });

        const lastInsertId = newLocker.id;

        if (typeQuetity === 'single') {
            for (let i = 1; i <= floorQutity; i++) {
                newFloor = await prisma.lockerFloors.create({
                    data: {
                        FloorNo: Number(i),
                        FloorQutity: Number(limitdoc),
                        LockerNo: lastInsertId,
                    },
                });
            }
        } else if (typeQuetity === 'multi') { 
            for (let i = 0; i < limitdoc.length; i++) {
                newFloor = await prisma.lockerFloors.create({
                    data: {
                        FloorNo:  (i + 1),
                        FloorQutity: Number(limitdoc[i].name),
                        LockerNo: lastInsertId,
                    },
                });   
            }
        }

        const lockers = await prisma.lockers.findMany({
            where: {
                LockerZone: UserZone,
            },
            include: {
                Lockerfloor: true,
            },
            orderBy: {
                id: 'desc',
            }
        });

        await redisClient.del(`lockers-${UserZone}`);
        
        return res.status(201).json({
            "message": "Create locker and floor successfully",
            "body": lockers,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'createSafe faild',
            error: error,
        });
    }
});

router.get('/fecthLockers', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 200;

        const UserZone = DecriptToeken(req).user.user_zone;
        const lockerCache = await redisClient.get(`lockers-${UserZone}`);
        
        if (lockerCache) {
            const response = JSON.parse(lockerCache);
            return res.status(200).json(response);
        }

        const [results, itemCount] = await Promise.all([
            prisma.lockers.findMany({
                skip: (page - 1) * limit,
                take: limit,
                where: {
                    LockerZone: Number(UserZone),
                },
                include: {
                    Lockerfloor: true,
                },
                orderBy: {
                    id: 'desc',
                }
            }),
            prisma.lockers.count(),
        ]);

        const totalPages = Math.ceil(itemCount / limit);

        const resData = {
            message: "fecthLockers successfully",
            has_more: paginate.hasNextPages(req)(totalPages),
            body: results, totalPages, itemCount,
            currentPage: page,
            pages: paginate.getArrayPages(req)(totalPages, totalPages, page),
        };

        const lockersToString = JSON.stringify(resData);
        await redisClient.set(`lockers-${UserZone}`, lockersToString);

        return res.status(200).json(resData);
    } catch (error) {
        return res.status(500).json({
            "message": "fecthLockers faild",
            "error": error,
        });
    }
});

router.get('/fecthLocker/:id', async (req, res) => {
    try {
        const { id } = req.params; 

        const response = await prisma.lockers.findFirst({
            where: {
                id: Number(id),
                NOT: {
                    LockerColorId: null, 
                }
            }
        });

        if (!response) {
            throw 'Locker not found!';
        }

        return res.status(200).json({
            message: 'Fetching Locker successfully!',
            body: response,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'fecthLocker faild',
            error: error,
        });
    }
});

router.put('/updateLocker/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { lockerName , floorQutity, limitdoc, LockerZone } = await req.body;

        const recheckResponse = await prisma.lockers.findFirst({
            where: {
                id: Number(id),
            },
            include: {
                Lockerfloor: true,
            }
        });

        if (!recheckResponse) {
            throw 'Locker not found!';
        }

        const calFloors = floorQutity > recheckResponse.FloorQutity ? floorQutity : (recheckResponse.Lockerfloor.length - floorQutity);

        await prisma.lockers.update({
            where: {
                id: Number(id),
            },
            data: {
                LockerName: lockerName,
                FloorQutity: Number(calFloors),
                LimitDoc: Number(limitdoc),
                LockerZone: Number(LockerZone),
            }
        });

        if (floorQutity > recheckResponse.Lockerfloor.length) {
            for (let i = recheckResponse.Lockerfloor.length + 1; i <= floorQutity; i++) {
                await prisma.lockerFloors.create({
                    data: {
                        FloorNo: Number(i),
                        LockerNo: Number(id),
                        LocFloorActive: 'yes',
                    }
                });
            }
        }

        if (floorQutity < recheckResponse.Lockerfloor.length) {
            for (let i = recheckResponse.Lockerfloor.length; i > calFloors; i--) {
                await prisma.lockerFloors.update({
                    where: {
                        FloorNo: Number(i),
                    },
                    data: {
                        LocFloorActive: 'no',
                    }
                });
            }
        }

        await redisClient.del('lockers');
        const response = await prisma.lockers.findMany({
            include: {
                Lockerfloor: true,
            },
        });

        return res.status(200).json({
            message: "Update locker successfully",
            body: response,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'updateLocker faild',
            error: error,
        });
    }
});

router.delete('/deleteLocker/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const delLockerFloors = await prisma.lockerFloors.deleteMany({
            where: {
                LockerNo: Number(id),
            }
        });

        const lockerDelete = await prisma.lockers.delete({
            where:{
                id: Number(id),
            }
        });

        return res.status(200).json({
            message: "Delete locker successfully",
            body: {
                lockerDelete,
                delLockerFloors,
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: 'deleteLocker faild',
            error: error,
        });
    }
});

router.post('/typetakedocument', async (req, res) => {
    try {
        const { nameTH, nameENG, ZoneActive } = req.body;

        const ZoneToString = JSON.stringify(ZoneActive);

        await prisma.tBTypeTakeDoc.create({
            data: {
                name_th: nameTH,
                name_eng: nameENG,
                ZoneActive: ZoneToString,
            }
        });

        const response = await prisma.tBTypeTakeDoc.findMany();

        return res.status(201).json({
            message: "Create take document successfully",
            body: response,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'create typetakedocument faild',
            error: error,
        });
    }
});

router.get('/typetakedocument', async (req, res) => {
    try {
        const response = await prisma.tBTypeTakeDoc.findMany();
        const userZone = await DecriptToeken(req).user.user_zone;
        const dataBranch = await checkZoneActive(response, userZone);

        return res.status(200).json({
            message: "fecth take document successfully",
            body: dataBranch,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'get typetakedocument faild',
            error: error,
        });
    }
});

router.get('/typetakedocument/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const response = await prisma.tBTypeTakeDoc.findFirst({
            where: {
                id: Number(id),
            }
        });

        if (response === null) {
            throw 'Take document not found!';
        }

        return res.status(200).json({
            message: "fecth take document successfully",
            body: response,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'get typetakedocument faild',
            error: error,
        });
    }
});

router.put('/typetakedocument/:id', async (req, res) => {
    try {
        const { nameTH, nameENG, ZoneActive } = req.body;
        const { id } = req.params;

        const ZoneToString = JSON.stringify(ZoneActive);

        await prisma.tBTypeTakeDoc.update({
            where: {
                id: Number(id),
            },
            data: {
                name_th: nameTH,
                name_eng: nameENG,
                ZoneActive: ZoneToString,
            }
        });

        const response = await prisma.tBTypeTakeDoc.findMany();

        return res.status(200).json({
            message: "Update take document successfully",
            body: response,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'update typetakedocument faild',
            error: error,
        });
    }
});

router.delete('/typetakedocument/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const response = await prisma.tBTypeTakeDoc.delete({
            where: {
                id: Number(id),
            }
        });

        return res.status(200).json({
            message: "Delete take document successfully",
            body: response,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'delete typetakedocument faild',
            error: error,
        });
    }
});

router.post('/bookmarks', async (req, res) => {
    try {
        const { userId, lockerId, bookActive } = req.body;
        let bookmarks = [];

        const reCheck = await prisma.lockerbookmarks.findFirst({
            where: {
                UserBook: Number(userId),
                LockerId: Number(lockerId),
            }
        });

        if (reCheck === null) {
            bookmarks = await prisma.lockerbookmarks.create({
                data: {
                    UserBook: Number(userId),
                    LockerId: Number(lockerId),
                }
            });
        }

        if (reCheck !== null) {
            bookmarks = await prisma.lockerbookmarks.update({
                where: {
                    id: Number(reCheck.id),
                },
                data: {
                    bookmarkActive: bookActive,
                }
            });
        }

        return res.status(201).json({
            message: "Create bookmarks successfully",
            body: bookmarks,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'update bookmarks faild',
            error: error,
        });
    }
});

router.get('/lockerfloors/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let lockerContract = [];
        const UserZone = await DecriptToeken(req).user.user_zone;

        const response = await prisma.lockers.findMany({
           where: {
                id: Number(id),
           },
           include: {
                Lockerfloor: {
                    select: {
                        id: true,
                        FloorNo: true,
                        LocFloorActive: true,
                        FloorQutity: true,
                    },
                    where: {
                        LocFloorActive: 'yes',
                    }
                },
           },
        });

        if (response[0].LockerZone !== UserZone) throw 'Permission denied!';

        if (response === null) {
            throw 'Floor not found!';
        }

        const floors = response[0].Lockerfloor;

        for (let i = 0; i < floors.length; i++) {
            lockerContract[i] = await prisma.lockerContracts.aggregate({
                _count: {
                    CONTNO: true,
                },
                where: {
                    LocFloorId: Number(floors[i].id),
                }
            });        
        }

        const lockerCont = await lockerContract.length === 0 ? 'No contract found!' : lockerContract;

        return res.status(200).json({
            message: "fecth lockerfloors successfully",
            body: {
                response,
                lockerCont,
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: 'get lockerfloors faild',
            error: error,
        });
    }
});

router.get('/lockercontract/:id', async (req, res) => {
    try {
        const response = await prisma.lockers.findMany({
            include: {
                Lockerfloor: {
                    where: {
                        LocFloorActive: 'yes',
                    },
                    include: {
                        LockerCont: true,
                    }
                }
            }
        });

        return res.status(200).json({
            message: "Fecth all lockerfloors successfully",
            body: response,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Fecth all lockercontract faild',
            error: error,
        })
    }
});

router.get('/floorcontract/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const response = await prisma.lockerContracts.findMany({
            where: {
                LocFloorId: Number(id),
            },
            include: {
                CONT: true,
                LocFloor: true,
            }
        });

        if (response === null) {
            throw 'Contract not found!';
        }

        return res.status(200).json({
            message: "fecth lockercontract successfully",
            body: response,
        });
    } catch (error) {
        return res.status(500).json({
            message: "fecth contract in locker faild",
            error: error,
        })
    }
});

router.get('/floorcontract/:lockerId/:floorId', async (req, res) => {
    try {
        const { lockerId, floorId } = req.params;

        const response = await prisma.lockers.findMany({
            where: {
                id: Number(lockerId),
            },
            include: {
                Lockerfloor: {
                    where: {
                        id: Number(floorId),
                    },
                    include: {
                        LockerCont: true,
                    }
                }
            }
        });
        
        return res.status(200).json({
            message: "fecth contracts successfully",
            body: response,
        });
    } catch (error) {
        return res.status(500).json({
            message: "fecth contract in locker faild",
            error: error,
        });
    }
});

router.post('/recently', async (req, res) => {
    try {
        
        const { lockerPath, ContNo } = req.body;
        const UserId = DecriptToeken(req).user.id;

        const response = await prisma.recentlyConts.create({
            data: {
                userRecent: UserId,
                contLink: lockerPath,
                contNo: ContNo,
            },
        });

        return res.status(201).json({
            message: "Create recently successfully",
            body: response,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'get recently faild',
            error: error,
        })
    }
});

router.get('/recently', async (req, res) => {
    try {
        const userId = DecriptToeken(req).user.id;

        const response = await prisma.recentlyConts.groupBy({
            _count: {
                contLink: true,
            },
            by: ['contLink', 'contNo'],
            where: {
                userRecent: userId,
            }
        });

        return res.status(200).json({
            message: "fecth recently successfully",
            body: response,
        });
    } catch (error) {
        return res.status(500).json({
            message: "get recently faild",
            error: error,
        });
    }
});

module.exports = router;