import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db/client";
import { read, utils, writeFile, write } from "xlsx";

const download = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.query.type == "pelanggaran") {
    try {
      // res.setHeader(
      //   "Content-Disposition",
      //   'attachment; filename="SheetJSNode.xlsx"'
      // );
      // res.setHeader("Content-Type", "application/vnd.ms-excel");
      const pelanggaran = await prisma.pelanggaran.findMany({
        where: {
          type: {
            not: "Penghargaan",
          },
        },
        select: {
          pemberi: true,
          deskripsi: true,
          point: true,
          type: true,
        },
      });
      const dataSheet = utils.json_to_sheet(pelanggaran);
      const wb = { Sheets: { data: dataSheet }, SheetNames: ["data"] };
      const binaryWorkbook = write(wb, {
        type: "array",
        bookType: "xlsx",
      });

      return res.status(200).send(binaryWorkbook);
    } catch (_error) {
      return res.status(500);
    }
  }
};

export default download;
