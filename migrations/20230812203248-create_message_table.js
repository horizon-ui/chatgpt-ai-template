'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('messages', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID, // Using UUID for unique id
                defaultValue: Sequelize.UUIDV4 // Auto-generate UUIDs
            },
            type: {
                type: Sequelize.ENUM('user', 'bot'),
                allowNull: false
            },
            message: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('messages');
    }
};
