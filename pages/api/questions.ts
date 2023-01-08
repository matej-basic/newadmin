import { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from 'fs';
import path from 'path';

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
    const { method } = _req;

    if (method != "POST") {
        res.status(400).send("Wrong request")
        return
    }

    const jsonDirectory = path.join(process.cwd(), 'json')
    const fileContents = await fs.readFile(jsonDirectory + '/questions.json', 'utf-8');
    const questions_json = JSON.parse(fileContents)

    res.status(200).send(questions_json);
    return

}

export default handler;