import { Box, Flex, Heading, Icon, Stack, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useRef, useState } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { FaPenAlt, FaServicestack } from "react-icons/fa";
import {
  IoHome,
  IoInformation,
  IoPeople,
  IoPrint,
  IoSchool,
  IoSettings,
  IoTime,
} from "react-icons/io5";
import {
  MdComputer,
  MdDoNotTouch,
  MdHomeRepairService,
  MdMedicalServices,
  MdRoomService,
} from "react-icons/md";
import { renderThumb, renderTrack, renderView } from "../Scrollbar";

interface FeatureProps {
  text: string;
  iconBg: any;
  icon?: ReactElement;
  active: boolean;
  url: string;
}

const Feature = ({ text, icon, iconBg, active, url }: FeatureProps) => {
  return (
    <Link href={url}>
      <Stack
        direction={"row"}
        className="group transition-all cursor-pointer"
        align={"center"}
      >
        <Flex
          w={7}
          h={7}
          align={"center"}
          justify={"center"}
          rounded={"10"}
          bg={iconBg}
        >
          {icon}
        </Flex>
        <Text className={`${active && "font-bold"} group-hover:font-bold`}>
          {text}
        </Text>
      </Stack>
    </Link>
  );
};

const adminItems = [
  {
    heading: "Home",
    menu: [
      {
        icon: IoHome,
        title: "Dashboard",
        url: "/admin",
        prefix: "home",
      },
    ],
  },
  {
    heading: "Pendataan",
    menu: [
      {
        icon: IoPeople,
        title: "User",
        url: "/admin/data/users",
        prefix: "data/users",
      },
      {
        icon: IoPeople,
        title: "Guru",
        url: "/admin/data/guru",
        prefix: "data/guru",
      },
      {
        icon: IoPeople,
        title: "Siswa",
        url: "/admin/data/siswa",
        prefix: "data/siswa",
      },
      {
        icon: IoSchool,
        title: "Kelas",
        url: "/admin/data/kelas",
        prefix: "data/kelas",
      },
    ],
  },
  {
    heading: "Tata Tertib",
    menu: [
      {
        icon: FaPenAlt,
        title: "Poin",
        url: "/admin/tatib/point",
        prefix: "tatib/point",
      },
      {
        icon: MdDoNotTouch,
        title: "Terlambat",
        url: "/admin/tatib/terlambat",
        prefix: "tatib/terlambat",
      },
    ],
  },
  {
    heading: "Layanan",
    menu: [
      {
        icon: MdHomeRepairService,
        title: "Bimbingan",
        url: "/admin/layanan/bimbingan",
        prefix: "layanan/bimbingan",
      },
    ],
  },
  {
    heading: "Labkom",
    menu: [
      {
        icon: MdComputer,
        title: "Pengajuan",
        url: "/admin/labkom/pengajuan",
        prefix: "labkom/pengajuan",
      },
    ],
  },
  {
    heading: "Laporan",
    menu: [
      {
        icon: IoPrint,
        title: "Jadwal Bimbingan",
        url: "/admin/laporan/jadwal-bimbingan",
        prefix: "laporan/jadwal-bimbingan",
      },
      {
        icon: IoPrint,
        title: "Bimbingan",
        url: "/admin/laporan/bimbingan",
        prefix: "laporan/bimbingan",
      },
      {
        icon: IoPrint,
        title: "Pelanggaran",
        url: "/admin/laporan/pelanggaran",
        prefix: "laporan/pelanggaran",
      },
      {
        icon: IoPrint,
        title: "Terlambat",
        url: "/admin/laporan/terlambat",
        prefix: "laporan/terlambat",
      },
      {
        icon: IoPrint,
        title: "Panggilan",
        url: "/admin/laporan/panggilan",
        prefix: "laporan/panggilan",
      },
      {
        icon: IoPrint,
        title: "Poin Penghargaan",
        url: "/admin/laporan/penghargaan",
        prefix: "laporan/penghargaan",
      },
      {
        icon: IoPrint,
        title: "Pengajuan Lab. Kom",
        url: "/admin/laporan/pengajuan-lab",
        prefix: "laporan/pengajuan-lab",
      },
      {
        icon: IoPrint,
        title: "Pengajuan Buku",
        url: "/admin/laporan/pengajuan-buku",
        prefix: "laporan/pengajuan-buku",
      },
    ],
  },
  {
    heading: "Informasi",
    menu: [
      {
        icon: IoInformation,
        title: "Informasi",
        url: "/admin/informasi",
        prefix: "admin/informasi",
      },
    ],
  },
  {
    heading: "Pengaturan",
    menu: [
      {
        icon: IoSettings,
        title: "Umum",
        url: "/admin/pengaturan/umum",
        prefix: "admin/pengaturan/umum",
      },
    ],
  },
];

const bkItems = [
  {
    heading: "Home",
    menu: [
      {
        icon: IoHome,
        title: "Dashboard",
        url: "/admin",
        prefix: "home",
      },
    ],
  },
  {
    heading: "Pendataan",
    menu: [
      {
        icon: IoPeople,
        title: "Siswa",
        url: "/admin/data/siswa",
        prefix: "data/siswa",
      },
      {
        icon: IoSchool,
        title: "Kelas",
        url: "/admin/data/kelas",
        prefix: "data/kelas",
      },
    ],
  },
  {
    heading: "Tata Tertib",
    menu: [
      {
        icon: FaPenAlt,
        title: "Poin",
        url: "/admin/tatib/point",
        prefix: "tatib/point",
      },
      {
        icon: MdDoNotTouch,
        title: "Terlambat",
        url: "/admin/tatib/terlambat",
        prefix: "tatib/terlambat",
      },
    ],
  },
  {
    heading: "Layanan",
    menu: [
      {
        icon: MdHomeRepairService,
        title: "Bimbingan",
        url: "/admin/layanan/bimbingan",
        prefix: "layanan/bimbingan",
      },
    ],
  },
];

const guruItems = [
  {
    heading: "Home",
    menu: [
      {
        icon: IoHome,
        title: "Dashboard",
        url: "/admin",
        prefix: "home",
      },
    ],
  },
  {
    heading: "Pendataan",
    menu: [
      {
        icon: IoPeople,
        title: "Siswa",
        url: "/admin/data/siswa",
        prefix: "data/siswa",
      },
      {
        icon: IoSchool,
        title: "Kelas",
        url: "/admin/data/kelas",
        prefix: "data/kelas",
      },
    ],
  },
  {
    heading: "Labkom",
    menu: [
      {
        icon: MdComputer,
        title: "Pengajuan",
        url: "/admin/labkom/guru/pengajuan",
        prefix: "labkom/guru/pengajuan",
      },
    ],
  },
];

const ItemSidebar = () => {
  const router = useRouter();
  const { data: dataUser } = useSession();
  const ref = useRef<any>();
  const [isServer, setIsServer] = useState(false);

  useEffect(() => {
    window && setIsServer(true);
  }, []);

  // const onScrollStart = () => {
  //   if (ref) {
  //     const { scrollTop } = ref.current.getValues();
  //     console.log(scrollTop)
  //   }
  // };

  return (
    <div className="flex overflow-auto flex-col pl-[30px] w-full pb-5">
      {dataUser?.role == "admin" &&
        adminItems.map((item, idx) => {
          return (
            <div className="mt-[20px]" key={idx}>
              <Heading size={"sm"}>{item.heading}</Heading>
              <div className="flex flex-col mt-[10px] gap-[10px]">
                {item.menu.map((itm, ind) => (
                  <div key={ind}>
                    <Feature
                      icon={
                        <Icon
                          as={itm.icon}
                          color={
                            itm.url == router.pathname ||
                            router.pathname.includes(itm.prefix)
                              ? "orange.500"
                              : "orange.200"
                          }
                          w={5}
                          h={5}
                        />
                      }
                      url={itm.url}
                      active={
                        itm.url == router.pathname ||
                        router.pathname.includes(itm.prefix)
                      }
                      iconBg={
                        itm.url == router.pathname ||
                        router.pathname.includes(itm.prefix)
                          ? "orange.200"
                          : ""
                      }
                      text={itm.title}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      {dataUser?.role == "guru" &&
        guruItems.map((item, idx) => {
          return (
            <div className="mt-[20px]" key={idx}>
              <Heading size={"md"}>{item.heading}</Heading>
              <div className="flex flex-col mt-[10px] gap-[10px]">
                {item.menu.map((itm, ind) => (
                  <div key={ind}>
                    <Feature
                      icon={
                        <Icon
                          as={itm.icon}
                          color={
                            itm.url == router.pathname ||
                            router.pathname.includes(itm.prefix)
                              ? "orange.500"
                              : "orange.200"
                          }
                          w={4}
                          h={4}
                        />
                      }
                      url={itm.url}
                      active={
                        itm.url == router.pathname ||
                        router.pathname.includes(itm.prefix)
                      }
                      iconBg={
                        itm.url == router.pathname ||
                        router.pathname.includes(itm.prefix)
                          ? "orange.200"
                          : ""
                      }
                      text={itm.title}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      {dataUser?.role == "bk" &&
        bkItems.map((item, idx) => {
          return (
            <div className="mt-[20px]" key={idx}>
              <Heading size={"md"}>{item.heading}</Heading>
              <div className="flex flex-col mt-[10px] gap-[10px]">
                {item.menu.map((itm, ind) => (
                  <div key={ind}>
                    <Feature
                      icon={
                        <Icon
                          as={itm.icon}
                          color={
                            itm.url == router.pathname ||
                            router.pathname.includes(itm.prefix)
                              ? "orange.500"
                              : "orange.200"
                          }
                          w={4}
                          h={4}
                        />
                      }
                      url={itm.url}
                      active={
                        itm.url == router.pathname ||
                        router.pathname.includes(itm.prefix)
                      }
                      iconBg={
                        itm.url == router.pathname ||
                        router.pathname.includes(itm.prefix)
                          ? "orange.200"
                          : ""
                      }
                      text={itm.title}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default ItemSidebar;
