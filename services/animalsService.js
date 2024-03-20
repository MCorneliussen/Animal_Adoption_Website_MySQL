const { sequelize } = require('../models');

const animalsAge = () => {
    const query = `    
    SELECT *, TIMESTAMPDIFF(YEAR, birthDate, CURDATE()) AS age
    FROM Animals;
    `;
    return sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
};

module.exports = {
    animalsAge,
};