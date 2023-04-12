import { Konseling, Panggilortu, Siswa, Tindaklanjut } from "@prisma/client";
import moment from "moment";
import { NextPage } from "next";
import Image from "next/image";
import { forwardRef, LegacyRef, ReactNode } from "react";
import LogoSMA from "../../assets/logo/logo-smabat.png";
import LogoKALSEL from "../../assets/logo/logo_kalsel.png";
import "moment/locale/id";

interface Filter {
  start_date: any;
  end_date: any;
  type: string;
}

interface Props {
  children?: ReactNode;
  data:
    | (Tindaklanjut & {
        siswa: Siswa;
      })[]
    | undefined;
  filter: Filter;
}

export type Ref = HTMLDivElement;

const Laporan = (props: Props, ref: LegacyRef<Ref>) => {
  return (
    <div className="font-surat p-5 min-h-[100vh]" ref={ref}>
      <div className="flex justify-center flex-row gap-7">
        <div>
          <Image src={LogoKALSEL} alt="_logo" width={50} height={60} />
        </div>
        <div className="text-center tracking-wide text-[14px]">
          <p className="font-bold">LAPORAN JADWAL BIMBINGAN</p>
          <p className="font-bold">SMA NEGERI 1 BATI-BATI</p>
          <p className="font-bold">TAHUN AJARAN 2022/2023</p>
        </div>
        <div>
          <Image src={LogoSMA} alt="_logo" width={50} height={60} />
        </div>
      </div>
      <div className="w-full h-[1px] bg-black opacity-30 mt-3"></div>
      {props.filter.end_date !== "" ||
      props.filter.type !== "" ||
      props.filter.start_date !== "" ? (
        <div className="mt-3 w-full flex flex-col items-center justify-center">
          {props.filter.type && (
            <p>
              Bidang: <strong>{props.filter.type}</strong>
            </p>
          )}
          {props.filter.start_date && props.filter.end_date && (
            <p>
              Dari tanggal <strong>{props.filter.start_date}</strong> -{" "}
              <strong>{props.filter.end_date}</strong>
            </p>
          )}
        </div>
      ) : null}
      <div className="mt-5 w-full flex flex-col items-center justify-center">
        <table className="table w-full text-[12px] table-auto border border-collapse">
          <thead>
            <tr>
              <th className="border px-2">NAMA SISWA</th>
              <th className="border px-2">KELAS</th>
              <th className="border px-2">HARI, TANGGAL</th>
              <th className="border px-2">BIDANG</th>
              <th className="border px-2">PERMASALAHAN</th>
              <th className="border px-2">PENANGANAN</th>
              <th className="border px-2">TINDAK LANJUT</th>
            </tr>
          </thead>
          <tbody>
            {props.data?.map((item, idx) => {
              return (
                <tr key={idx}>
                  <td className="border px-2 text-center">
                    {item.siswa?.nama}
                  </td>
                  <td className="border px-2 text-center">
                    {item.siswa?.kelas}
                  </td>
                  <td className="border px-2 text-center">
                    {moment(item.tanggal).format("dddd, DD/MM/YYYY")}
                  </td>
                  <td className="border px-2 text-center">{item.type}</td>
                  <td width={200} className="border px-2">
                    <p className="whitespace-pre-wrap w-[200px]">
                      {item.deskripsi}
                    </p>
                  </td>
                  <td width={200} className="border px-2">
                    <p className="whitespace-pre-wrap w-[200px]">
                      {item.penanganan}
                    </p>
                  </td>
                  <td width={200} className="border px-2">
                    <p className="whitespace-pre-wrap w-[200px]">
                      {item.tindakan}
                    </p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const LaporanBimbinganPDF = forwardRef<Ref, Props>(Laporan);
