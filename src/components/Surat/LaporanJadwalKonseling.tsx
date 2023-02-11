import { Konseling, Panggilortu, Siswa, Tindaklanjut } from "@prisma/client";
import moment from "moment";
import { NextPage } from "next";
import Image from "next/image";
import { forwardRef, LegacyRef, ReactNode } from "react";
import LogoSMA from "../../assets/logo/logo-smabat.png";
import LogoKALSEL from "../../assets/logo/logo_kalsel.png";
import "moment/locale/id";

interface Props {
  children?: ReactNode;
  data: (Konseling & {
    siswa: Siswa;
})[] | undefined;
}

export type Ref = HTMLDivElement;

const Surat = (props: Props, ref: LegacyRef<Ref>) => {
  console.log(props.data);
  return (
    <div className="font-surat p-5" ref={ref}>
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
      <div className="mt-5 w-full flex flex-col items-center justify-center">
        <table className="table w-full text-[12px] table-auto border border-collapse">
          <thead>
            <tr>
              <th className="border px-2">HARI, TANGGAL</th>
              <th className="border px-2">NAMA SISWA</th>
              <th className="border px-2">KELAS SISWA</th>
              <th className="border px-2">JAM</th>
              <th className="border px-2">KELUHAN</th>
            </tr>
          </thead>
          <tbody>
            {props.data?.map((item, idx) => {
              return (
                <tr key={idx}>
                  <td className="border px-2">
                    {moment(item.tanggal).format("dddd, DD/MM/YYYY")}
                  </td>
                  <td className="border px-2">{item.siswa?.nama}</td>
                  <td className="border px-2">{item.siswa?.kelas}</td>
                  <td className="border px-2">{item.jam} WITA</td>
                  <td width={200} className="border px-2">
                    <p className="whitespace-pre-wrap w-[100px]">
                      {item.keluhan}
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

export const LaporanKonseling = forwardRef<Ref, Props>(Surat);
