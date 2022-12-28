import { Guru, Panggilortu, Siswa, Tindaklanjut } from "@prisma/client";
import moment from "moment";
import { NextPage } from "next";
import Image from "next/image";
import { forwardRef, LegacyRef, ReactNode } from "react";
import LogoSMA from "../../assets/logo/logo-smabat.png";
import LogoKALSEL from "../../assets/logo/logo_kalsel.png";
import "moment/locale/id";

interface Props {
  children?: ReactNode;
  data: Siswa[] | undefined;
  dataGuru: Guru
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
          <p className="font-bold">LAPORAN DATA SISWA</p>
          <p className="font-bold">SMA NEGERI 1 BATI-BATI</p>
          <p className="font-bold">TAHUN AJARAN 2022/2023</p>
        </div>
        <div>
          <Image src={LogoSMA} alt="_logo" width={50} height={60} />
        </div>
      </div>
      <div className="mt-5">
        <div className="w-full flex flex-col gap-3">
          {props.dataGuru && (
            <table className="table text-[12px]">
              <tbody>
                <tr>
                  <td width={200} className="align-top font-bold">
                    Wali Kelas
                  </td>
                  <td width={30} className="align-top">
                    :
                  </td>
                  <td>{props.dataGuru.nama}</td>
                </tr>
                <tr>
                  <td width={200} className="align-top font-bold">
                    NIP
                  </td>
                  <td width={30} className="align-top">
                    :
                  </td>
                  <td>{props.dataGuru.nip}</td>
                </tr>
                <tr>
                  <td width={200} className="align-top font-bold">
                    Kelas
                  </td>
                  <td width={30} className="align-top">
                    :
                  </td>
                  <td>{props.dataGuru.namaKelas}</td>
                </tr>
              </tbody>
            </table>
          )}
          <table className="table text-[12px] w-full table-auto border border-collapse">
            <thead>
              <tr>
                <th className="border px-2">No</th>
                <th className="border px-2">Nama Siswa</th>
                <th className="border px-2">NIS</th>
                <th className="border px-2">Jenis Kelamin</th>
              </tr>
            </thead>
            <tbody>
              {props.data?.map((item, idx) => {
                return (
                  <tr key={idx}>
                    <td className="border text-center px-2">{idx + 1}</td>
                    <td className="border px-2">{item.nama}</td>
                    <td className="border px-2">{item.nis}</td>
                    <td className="border px-2">{item.jenisKelamin}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
       
      </div>
    </div>
  );
};

export const RekapSiswaPerkelas = forwardRef<Ref, Props>(Surat);
