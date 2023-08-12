// pages/api/messages.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Sequelize } from 'sequelize';
import { Message, initialize } from '../../models/messages'; 

const sequelize = new Sequelize('mysql://user:password@chatdb:3306/dev');
initialize(sequelize);

const handleMessages = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        switch (req.method) {
            case 'GET':
                const messages = await Message.findAll();
                res.json(messages);
                break;
            case 'POST':
                const message = await Message.create(req.body);
                res.json(message);
                break;
            case 'PUT':
                await Message.update(req.body, {
                    where: { id: req.body.id }
                });
                res.json({ success: true });
                break;
            case 'DELETE':
                // Check if it's a truncate operation based on query parameter
                if (req.query.truncate === 'true') {
                    await Message.truncate();
                    res.json({ success: true });
                } else {
                    // Handle regular delete action
                    await Message.destroy({
                        where: { id: req.body.id }
                    });
                    res.json({ success: true });
                }
                break;
            default:
                res.status(405).end(); // Method not allowed
                break;
        }
    } catch (error) {
        console.error("Error in /api/messages:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export default handleMessages;
