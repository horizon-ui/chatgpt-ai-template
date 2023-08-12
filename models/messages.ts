// models/message.ts
import { Model, DataTypes, Sequelize } from 'sequelize';

export class Message extends Model {
    public id!: string; 
    public type!: 'user' | 'bot';
    public message!: string;

    static async create(body: any): Promise<Message> {
        return super.create(body);
    }

    static async update(body: any, options: { where: { id: any; }; }): Promise<[number, Message[]]> {
        return super.update(body, options);
    }

    static async findAll(): Promise<Message[]> {
        return super.findAll({
            order: [['createdAt', 'ASC']]
        });
    }

    static async truncate(): Promise<void> {
        return super.destroy({
            truncate: true
        });
    }
    
    static async destroyById(id: string): Promise<number> {
        return super.destroy({
            where: { id }
        });
    }    
    
}

export function initialize(sequelize: Sequelize) {
    Message.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        type: {
            type: DataTypes.ENUM('user', 'bot'),
            allowNull: false,
        },
        message: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: "<Loading>",
        },
    }, {
        sequelize,
        modelName: 'message',
    });
}
