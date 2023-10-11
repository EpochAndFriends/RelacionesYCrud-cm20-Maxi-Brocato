'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Genres', [
      {
        name: 'Acción',
        ranking: 1,
        active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Comedia',
        ranking: 2,
        active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Agrega más géneros aquí si lo deseas
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Genres', null, {});
  }
};
