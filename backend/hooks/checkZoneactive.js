const checkZoneActive = async (res, UserZone) => {
    let BranchActive = [];    
    
    for (let i = 0; i < res.length; i++) {
        let ZoneActive = JSON.parse(res[i].ZoneActive);
        for (let j = 0; j < ZoneActive.length; j++) {
            if (Number(ZoneActive[j]) === Number(UserZone)) {
                BranchActive[i] = res[i];
            }
        }
    }

    return BranchActive;
};

module.exports = checkZoneActive;