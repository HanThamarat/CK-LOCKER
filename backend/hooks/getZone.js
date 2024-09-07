const { PrismaClient } = require('@prisma/client');
const redisClient = require('../config/redis');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const getZones = async () => {
    const branches = await redisClient.get('zone');
    const token = req.headers['authorization'].split(' ')[1];

    if (!token) {
        return null;
    }

    if (branches) {
        const response = JSON.parse(branches);
        return response;
    }

    const response = await prisma.$queryRaw`
        select "Zone",
        case
            when "Zone" = 10 then 'PNHQ - ปัตตานี'
            when "Zone" = 20 then 'HTHQ - หาดใหญ่'
            when "Zone" = 30 then 'HTHQ01 - นครศรีธรรมราช'
            when "Zone" = 40 then 'KBHQ - กระบี่'
            when "Zone" = 50 then 'CKT - สุราษฎร์ธานี'
        end as ZoneName
        from "TBBranch" GROUP by "Zone" order by "Zone" asc 
    `;

    const zoneToString = JSON.stringify(response);
    await redisClient.set('zone', zoneToString);

    return response;
};

module.exports = getZones;