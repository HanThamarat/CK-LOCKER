const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const DecriptToeken = require('../hooks/decriptJwt');

const prisma = new PrismaClient();

router.post('/takedocument', async (req, res) => {
    try {
        const { contNo, typeTakedocId, typeLoan, Note, Locker, Floor } = req.body;
        const date = new Date();

        const UserData = DecriptToeken(req).user;
        
        const takedocument = await prisma.tBTakeDoc.create({
            data: {
                CONTNO: contNo,
                TakeType: Number(typeTakedocId),
                TypeLoans: typeLoan,
                Note: Note,
                LockerId: Number(Locker),
                LockerFloorId: Number(Floor),
                ReqTakeDT: date,
                UserZone: Number(UserData.user_zone),
                Branch: Number(UserData.user_branch),
                PersonTake: Number(UserData.id),
            }
        });

        return res.status(201).json({
            message: "Create takedocument successfully",
            body: takedocument,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'takedocument faild',
            error: error,
        });
    }
});

router.post('/takedocument/:contNo', async (req, res) => {
    try {
        const { contNo } = req.params;
        const { NameLoan } = req.body;

        const response = await prisma.$queryRaw`
            select "LockerName", "FloorNo", "CotractsLocker"."CONTNO", "NameLoan", "LockerNo"
            from ((("Lockers" left join "LockerFloors" on "Lockers"."id" = "LockerFloors"."LockerNo")
                left join "LockerContracts" on "LockerFloors"."id" = "LockerContracts"."LocFloorId")
                left join "CotractsLocker" on "LockerContracts"."CONTNO" = "CotractsLocker"."CONTNO")
            where "LockerContracts"."CONTNO" = ${contNo} and "NameLoan" = ${NameLoan} and "LockerFloors"."LocFloorActive" = 'yes'
        `;

        if (response.length === 0) throw 'Contract not found in locker!';

        return res.status(200).json({
            message: 'Fetching takedocument successfully!',
            body: response,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'get takedocument faild',
            error: error,
        });
    }
});

router.get('/takedocument/:branchId', async (req, res) => {
    try {
        const { branchId } = req.params;

        const response = await prisma.$queryRaw`
            select "TBTakeDoc"."id" ,"CONTNO", u."name" , ttd.name_th , "TakeSt"
            from "TBTakeDoc" 
                left join users u on "TBTakeDoc"."PersonTake" = "u"."id"
                left join "TBTypeTakeDoc" ttd on "TBTakeDoc"."TakeType" = "ttd"."id"
            where "Branch" = ${Number(branchId)}
        `;

        if (response === null) throw 'document not found!';

        return res.status(200).json({
            message: 'Fetching takedocument successfully!',
            body: response,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'get takedocument faild',
            error: error,
        });
    }
});

module.exports = router;