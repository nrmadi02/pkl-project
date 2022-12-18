import { Panggilortu, Pelanggaran, Siswa } from "@prisma/client";
import moment from "moment";
import { NextPage } from "next";
import Image from "next/image";
import { forwardRef, LegacyRef, ReactNode, useEffect, useState } from "react";
import LogoSMA from "../../assets/logo/logo-smabat.png";
import LogoKALSEL from "../../assets/logo/logo_kalsel.png";
import "moment/locale/id";
import _ from "lodash";

interface Props {
  children?: ReactNode;
  data: Pelanggaran[] | undefined;
  siswa: Siswa
}

export type Ref = HTMLDivElement;

const Surat = (props: Props, ref: LegacyRef<Ref>) => {
  const [dataPelanggaran, setDataPelanggaran] = useState<Pelanggaran[]>();
  useEffect(() => {
    setDataPelanggaran(props.data);
  }, [props]);

  return (
    <div className="font-surat p-5" ref={ref}>
      <div className="flex justify-center flex-row gap-7">
        <div>
          <Image src={LogoKALSEL} alt="_logo" width={50} height={60} />
        </div>
        <div className="text-center tracking-wide text-[14px]">
          <p className="font-bold">REKAPITULASI PELANGGARAN SISWA</p>
          <p className="font-bold">SMA NEGERI 1 BATI-BATI</p>
          <p className="font-bold">TAHUN AJARAN 2022/2023</p>
        </div>
        <div>
          <Image src={LogoSMA} alt="_logo" width={50} height={60} />
        </div>
      </div>

      <div className="px-10">
        <table className="table text-[12px]">
          <tbody>
            <tr>
              <td width={200} className="align-top font-bold">
                Nama Siswa
              </td>
              <td width={30} className="align-top">
                :
              </td>
              <td>{props.siswa.nama}</td>
            </tr>
            <tr>
              <td width={200} className="align-top font-bold">
                Kelas
              </td>
              <td width={30} className="align-top">
                :
              </td>
              <td>{props.siswa.kelas}</td>
            </tr>
          </tbody>
        </table>
        <table className="table text-[12px] table-auto border border-collapse">
          <colgroup>
            <col style={{ width: "50px" }} />
            <col style={{ width: "330px" }} />
            <col style={{ width: "40px" }} />
            <col style={{ width: "40px" }} />
            <col style={{ width: "40px" }} />
            <col style={{ width: "155px" }} />
            <col style={{ width: "155px" }} />
          </colgroup>
          <thead>
            <tr>
              <th className="border" rowSpan={2}>
                NO
              </th>
              <th className="border" rowSpan={2}>
                PELANGGARAN
              </th>
              <th className="border" colSpan={3}>
                BOBOT
              </th>
              <th className="border" colSpan={2} rowSpan={2}>
                PANGGILAN ORANG TUA
              </th>
            </tr>
            <tr>
              <th className="border">I</th>
              <th className="border">II</th>
              <th className="border">III</th>
            </tr>
          </thead>
          {dataPelanggaran ? (
            <tbody>
              {_.times(46, (i) => {
                if (i == 0 || i == 12 || i == 24) {
                  return (
                    <tr key={i}>
                      <td className="border text-center">{i + 1}</td>
                      <td className="border px-1">
                        {dataPelanggaran[i]
                          ? dataPelanggaran[i]?.deskripsi +
                            ` (${moment(dataPelanggaran[i]?.createdAt).format(
                              "DD/MM/YYYY"
                            )})`
                          : " "}
                      </td>
                      <td className="border text-center">
                        {dataPelanggaran[i] ? <p>&#10004;</p> : " "}
                      </td>
                      <td className="border text-center"></td>
                      <td className="border text-center"></td>
                      <td className="border font-bold text-center" colSpan={2}>
                        Panggilan{" "}
                        {(i == 0 && "I") ||
                          (i == 12 && "II") ||
                          (i == 24 && "III")}
                      </td>
                    </tr>
                  );
                }
                if (i == 1 || i == 13 || i == 25) {
                  return (
                    <tr key={i}>
                      <td className="border text-center">{i + 1}</td>
                      <td className="border px-1">
                        {dataPelanggaran[i]
                          ? dataPelanggaran[i]?.deskripsi +
                            ` (${moment(dataPelanggaran[i]?.createdAt).format(
                              "DD/MM/YYYY"
                            )})`
                          : " "}
                      </td>
                      <td className="border text-center">
                        {dataPelanggaran[i] ? <p>&#10004;</p> : " "}
                      </td>
                      <td className="border"></td>
                      <td className="border"></td>
                      <td className="border px-1" colSpan={2}>
                        JUMLAH SKOR :
                      </td>
                    </tr>
                  );
                }
                if (i == 2 || i == 14 || i == 26) {
                  return (
                    <tr key={i}>
                      <td className="border text-center">{i + 1}</td>
                      <td className="border px-1">
                        {dataPelanggaran[i]
                          ? dataPelanggaran[i]?.deskripsi +
                            ` (${moment(dataPelanggaran[i]?.createdAt).format(
                              "DD/MM/YYYY"
                            )})`
                          : " "}
                      </td>
                      <td className="border text-center">
                        {dataPelanggaran[i] ? <p>&#10004;</p> : " "}
                      </td>
                      <td className="border"></td>
                      <td className="border"></td>
                      <td className="border px-1" colSpan={2}>
                        TGL SURAT PANGGILAN :
                      </td>
                    </tr>
                  );
                }
                if (i == 3 || i == 15 || i == 27) {
                  return (
                    <tr key={i}>
                      <td className="border text-center">{i + 1}</td>
                      <td className="border px-1">
                        {dataPelanggaran[i]
                          ? dataPelanggaran[i]?.deskripsi +
                            ` (${moment(dataPelanggaran[i]?.createdAt).format(
                              "DD/MM/YYYY"
                            )})`
                          : " "}
                      </td>
                      <td className="border text-center">
                        {dataPelanggaran[i] ? <p>&#10004;</p> : " "}
                      </td>
                      <td className="border"></td>
                      <td className="border"></td>
                      <td className="border text-center px-1" colSpan={2}>
                        (.. / ../ 20..)
                      </td>
                    </tr>
                  );
                }
                if (i == 4 || i == 16 || i == 28) {
                  return (
                    <tr key={i}>
                      <td className="border text-center">{i + 1}</td>
                      <td className="border px-1">
                        {dataPelanggaran[i]
                          ? dataPelanggaran[i]?.deskripsi +
                            ` (${moment(dataPelanggaran[i]?.createdAt).format(
                              "DD/MM/YYYY"
                            )})`
                          : " "}
                      </td>
                      <td className="border text-center">
                        {dataPelanggaran[i] ? <p>&#10004;</p> : " "}
                      </td>
                      <td className="border"></td>
                      <td className="border"></td>
                      <td className="border px-1" colSpan={2}>
                        TGL KEDATANGAN ORTU
                      </td>
                    </tr>
                  );
                }
                if (i == 5 || i == 17 || i == 29) {
                  return (
                    <tr key={i}>
                      <td className="border text-center">{i + 1}</td>
                      <td className="border px-1">
                        {dataPelanggaran[i]
                          ? dataPelanggaran[i]?.deskripsi +
                            ` (${moment(dataPelanggaran[i]?.createdAt).format(
                              "DD/MM/YYYY"
                            )})`
                          : " "}
                      </td>
                      <td className="border text-center">
                        {dataPelanggaran[i] ? <p>&#10004;</p> : " "}
                      </td>
                      <td className="border"></td>
                      <td className="border"></td>
                      <td className="border text-center px-1" colSpan={2}>
                        (.. / ../ 20..)
                      </td>
                    </tr>
                  );
                }
                if (i == 6 || i == 18 || i == 30) {
                  return (
                    <tr key={i}>
                      <td className="border text-center">{i + 1}</td>
                      <td className="border px-1">
                        {dataPelanggaran[i]
                          ? dataPelanggaran[i]?.deskripsi +
                            ` (${moment(dataPelanggaran[i]?.createdAt).format(
                              "DD/MM/YYYY"
                            )})`
                          : " "}
                      </td>
                      <td className="border text-center">
                        {dataPelanggaran[i] ? <p>&#10004;</p> : " "}
                      </td>
                      <td className="border"></td>
                      <td className="border"></td>
                      <td
                        className="border font-bold text-center px-1"
                        colSpan={2}
                      >
                        TANDA TANGAN
                      </td>
                    </tr>
                  );
                }
                if (i == 7 || i == 19 || i == 31) {
                  return (
                    <tr key={i}>
                      <td className="border text-center">{i + 1}</td>
                      <td className="border">
                        {dataPelanggaran[i]
                          ? dataPelanggaran[i]?.deskripsi +
                            ` (${moment(dataPelanggaran[i]?.createdAt).format(
                              "DD/MM/YYYY"
                            )})`
                          : " "}
                      </td>
                      <td className="border"></td>
                      <td className="border"></td>
                      <td className="border"></td>
                      <td className="border text-center px-1">Guru BK</td>
                      <td className="border text-center px-1">ORANG TUA</td>
                    </tr>
                  );
                }
                if (i == 8 || i == 20 || i == 32) {
                  return (
                    <tr key={i}>
                      <td className="border text-center">{i + 1}</td>
                      <td className="border">
                        {dataPelanggaran[i]
                          ? dataPelanggaran[i]?.deskripsi +
                            ` (${moment(dataPelanggaran[i]?.createdAt).format(
                              "DD/MM/YYYY"
                            )})`
                          : " "}
                      </td>
                      <td className="border"></td>
                      <td className="border"></td>
                      <td className="border"></td>
                      <td className="border" rowSpan={3}></td>
                      <td className="border" rowSpan={3}></td>
                    </tr>
                  );
                }
                if (i == 9 || i == 21 || i == 33) {
                  return (
                    <tr key={i}>
                      <td className="border text-center">{i + 1}</td>
                      <td className="border">
                        {dataPelanggaran[i]
                          ? dataPelanggaran[i]?.deskripsi +
                            ` (${moment(dataPelanggaran[i]?.createdAt).format(
                              "DD/MM/YYYY"
                            )})`
                          : " "}
                      </td>
                      <td className="border"></td>
                      <td className="border"></td>
                      <td className="border"></td>
                    </tr>
                  );
                }
                if (i == 10 || i == 22 || i == 34) {
                  return (
                    <tr key={i}>
                      <td className="border text-center">{i + 1}</td>
                      <td className="border">
                        {dataPelanggaran[i]
                          ? dataPelanggaran[i]?.deskripsi +
                            ` (${moment(dataPelanggaran[i]?.createdAt).format(
                              "DD/MM/YYYY"
                            )})`
                          : " "}
                      </td>
                      <td className="border"></td>
                      <td className="border"></td>
                      <td className="border"></td>
                    </tr>
                  );
                }
                if (i == 11 || i == 23 || i == 35) {
                  return (
                    <tr key={i}>
                      <td className="border text-center">{i + 1}</td>
                      <td className="border">
                        {dataPelanggaran[i]
                          ? dataPelanggaran[i]?.deskripsi +
                            ` (${moment(dataPelanggaran[i]?.createdAt).format(
                              "DD/MM/YYYY"
                            )})`
                          : " "}
                      </td>
                      <td className="border"></td>
                      <td className="border"></td>
                      <td className="border"></td>
                      <td className="border" colSpan={2}>
                        <div className="w-full h-1 bg-black"></div>
                      </td>
                    </tr>
                  );
                }
                if (i == 36) {
                  return (
                    <tr key={i}>
                      <td className="border text-center">{i + 1}</td>
                      <td className="border">
                        {dataPelanggaran[i]
                          ? dataPelanggaran[i]?.deskripsi +
                            ` (${moment(dataPelanggaran[i]?.createdAt).format(
                              "DD/MM/YYYY"
                            )})`
                          : " "}
                      </td>
                      <td className="border"></td>
                      <td className="border"></td>
                      <td className="border"></td>
                      <td className="border font-bold text-center" colSpan={2}>
                        PEMBERHENTIAN / DO
                      </td>
                    </tr>
                  );
                }
                if (i == 37) {
                  return (
                    <tr key={i}>
                      <td className="border text-center">{1 + i}</td>
                      <td className="border">
                        {dataPelanggaran[i]
                          ? dataPelanggaran[i]?.deskripsi +
                            ` (${moment(dataPelanggaran[i]?.createdAt).format(
                              "DD/MM/YYYY"
                            )})`
                          : " "}
                      </td>
                      <td className="border"></td>
                      <td className="border"></td>
                      <td className="border"></td>
                      <td
                        className="border align-top px-1"
                        colSpan={2}
                        rowSpan={9}
                      >
                        <table className="table text-[12px]">
                          <tbody>
                            <tr>
                              <td width={100} className="align-top font-bold">
                                NO SK
                              </td>
                              <td width={30} className="align-top">
                                :
                              </td>
                              <td></td>
                            </tr>
                            <tr>
                              <td width={100} className="align-top font-bold">
                                TANGGAL SK
                              </td>
                              <td width={30} className="align-top">
                                :
                              </td>
                              <td></td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="w-full mt-2 text-left ml-7">
                          <p>
                            Bati-Bati, . . . . . . . . . . . . . . 20 . . . .
                          </p>
                          <p>Kepala SMA Negeri 1 Bati-Bati</p>
                        </div>
                      </td>
                    </tr>
                  );
                }
                if (i == 38) {
                  return (
                    <tr key={i}>
                      <td className="border text-center">{1 + i}</td>
                      <td className="border">
                        {dataPelanggaran[i]
                          ? dataPelanggaran[i]?.deskripsi +
                            ` (${moment(dataPelanggaran[i]?.createdAt).format(
                              "DD/MM/YYYY"
                            )})`
                          : " "}
                      </td>
                      <td className="border"></td>
                      <td className="border"></td>
                      <td className="border"></td>
                    </tr>
                  );
                }
                if (i == 39) {
                  return (
                    <tr key={i}>
                      <td className="border text-center">{1 + i}</td>
                      <td className="border">
                        {dataPelanggaran[i]
                          ? dataPelanggaran[i]?.deskripsi +
                            ` (${moment(dataPelanggaran[i]?.createdAt).format(
                              "DD/MM/YYYY"
                            )})`
                          : " "}
                      </td>
                      <td className="border"></td>
                      <td className="border"></td>
                      <td className="border"></td>
                    </tr>
                  );
                }
                if (i == 40) {
                  return (
                    <tr key={i}>
                      <td className="border text-center">{1 + i}</td>
                      <td className="border">
                        {dataPelanggaran[i]
                          ? dataPelanggaran[i]?.deskripsi +
                            ` (${moment(dataPelanggaran[i]?.createdAt).format(
                              "DD/MM/YYYY"
                            )})`
                          : " "}
                      </td>
                      <td className="border"></td>
                      <td className="border"></td>
                      <td className="border"></td>
                    </tr>
                  );
                }
                if (i == 41) {
                  return (
                    <tr key={i}>
                      <td className="border text-center">{1 + i}</td>
                      <td className="border">
                        {dataPelanggaran[i]
                          ? dataPelanggaran[i]?.deskripsi +
                            ` (${moment(dataPelanggaran[i]?.createdAt).format(
                              "DD/MM/YYYY"
                            )})`
                          : " "}
                      </td>
                      <td className="border"></td>
                      <td className="border"></td>
                      <td className="border"></td>
                    </tr>
                  );
                }
                if (i == 42) {
                  return (
                    <tr key={i}>
                      <td className="border text-center">{1 + i}</td>
                      <td className="border">
                        {dataPelanggaran[i]
                          ? dataPelanggaran[i]?.deskripsi +
                            ` (${moment(dataPelanggaran[i]?.createdAt).format(
                              "DD/MM/YYYY"
                            )})`
                          : " "}
                      </td>
                      <td className="border"></td>
                      <td className="border"></td>
                      <td className="border"></td>
                    </tr>
                  );
                }
                if (i == 43) {
                  return (
                    <tr key={i}>
                      <td className="border text-center">{1 + i}</td>
                      <td className="border">
                        {dataPelanggaran[i]
                          ? dataPelanggaran[i]?.deskripsi +
                            ` (${moment(dataPelanggaran[i]?.createdAt).format(
                              "DD/MM/YYYY"
                            )})`
                          : " "}
                      </td>
                      <td className="border"></td>
                      <td className="border"></td>
                      <td className="border"></td>
                    </tr>
                  );
                }
                if (i == 44) {
                  return (
                    <tr key={i}>
                      <td className="border text-center">{1 + i}</td>
                      <td className="border">
                        {dataPelanggaran[i]
                          ? dataPelanggaran[i]?.deskripsi +
                            ` (${moment(dataPelanggaran[i]?.createdAt).format(
                              "DD/MM/YYYY"
                            )})`
                          : " "}
                      </td>
                      <td className="border"></td>
                      <td className="border"></td>
                      <td className="border"></td>
                    </tr>
                  );
                }
                if (i == 45) {
                  return (
                    <tr key={i}>
                      <td className="border text-center">{1 + i}</td>
                      <td className="border">
                        {dataPelanggaran[i]
                          ? dataPelanggaran[i]?.deskripsi +
                            ` (${moment(dataPelanggaran[i]?.createdAt).format(
                              "DD/MM/YYYY"
                            )})`
                          : " "}
                      </td>
                      <td className="border"></td>
                      <td className="border"></td>
                      <td className="border"></td>
                    </tr>
                  );
                }
                return <p key={i}>{i}</p>;
              })}
            </tbody>
          ) : null}
        </table>
        <div className="mt-5 font-bold px-10 items-end text-[11px] flex flex-row justify-between">
          <div>
            <div>
              <p>Mengetahui</p>
              <p>Kepala SMA Negeri 1 Bati - Bati</p>
            </div>
            <div className="mt-10">
              <p>Taslim,S.PD M.Pd</p>
              <p>NIP. 19710602 199802 1 026</p>
            </div>
          </div>
          <div>
            <div>
              <p>Bati-Bati, 20 Juli 2022</p>
              <p>Penanggung Jawab Program</p>
              <p>Wakasek Kesiswaan,</p>
            </div>
            <div className="mt-10">
              <p>Taibah,S.Pd</p>
              <p>NIP.19720708 200604 2 006</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RekapitulasiPelanggaran = forwardRef<Ref, Props>(Surat);
