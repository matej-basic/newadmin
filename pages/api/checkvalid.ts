import { company_sizes, creative_sizes, accounting_sizes, it_sizes, vm_sizes } from "../../utils/sample-data";
import { NextApiRequest, NextApiResponse } from 'next';
import { Answer } from "../../interfaces/answer";

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
    const { method, body } = _req;

    const answer: Answer = body

    const SumIndexes = (answer: Answer) => {
        const acc = accounting_sizes.indexOf(answer.accounting_size)
        const cre = creative_sizes.indexOf(answer.creative_size)
        const it = it_sizes.indexOf(answer.it_size)
        const vm = vm_sizes.indexOf(answer.vm_size)

        return acc + cre + it + vm
    }

    if (SumIndexes(answer) == 0) {
        res.status(400).send("Invalid Answer")
    }

    if (answer.name == "") {
        res.status(400).send("Invalid Answer")
        return
    }

    if (answer.company_size == "1-5") {
        if (SumIndexes(answer) > 7) {
            res.status(400).send("Invalid Answer")
            return
        } else {
            res.status(200).send("Answer is Valid")
            return
        }
    } else if (answer.company_size == "6 - 50") {
        if (SumIndexes(answer) > 10) {
            res.status(400).send("Invalid Answer")
            return
        } else {
            res.status(200).send("Answer is Valid")
            return
        }
    } else if (answer.company_size == "51 - 250") {
        if (SumIndexes(answer) > 13) {
            res.status(400).send("Invalid Answer")
            return
        } else {
            res.status(200).send("Answer is Valid")
            return
        }
    } else if (answer.company_size == ">250") {
        res.status(200).send("Answer is Valid")
        return
    } else {
        res.status(400).send("Invalid Answer")
        return
    }
}

export default handler;