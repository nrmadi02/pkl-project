import { Flex, Heading, Icon, Stack, Text } from "@chakra-ui/react"
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { IoHome, IoPeople, IoSchool } from "react-icons/io5";

interface FeatureProps {
  text: string;
  iconBg: any;
  icon?: ReactElement;
  active: boolean;
  url: string 
}

const Feature = ({ text, icon, iconBg, active, url }: FeatureProps) => {
  return (
    <Link href={url}>
      <Stack direction={'row'} className='hover:scale-[1.02] group transition-all active:scale-100 cursor-pointer' align={'center'}>
        <Flex
          w={8}
          h={8}
          align={'center'}
          justify={'center'}
          rounded={'10'}
          bg={iconBg}>
          {icon}
        </Flex>
        <Text className={`${active && 'font-bold'} group-hover:font-bold`}>{text}</Text>
      </Stack>
    </Link>
  );
};

const adminItems = [
  {
    heading: 'Home',
    menu: [
      {
        icon: IoHome,
        title: 'Dashboard',
        url: '/admin'
      }
    ]
  },
  {
    heading: 'Pendataan',
    menu: [
      {
        icon: IoPeople,
        title: 'User',
        url: '/admin/data/users'
      },
      {
        icon: IoPeople,
        title: 'Guru',
        url: '/admin/data/guru'
      },
      {
        icon: IoSchool,
        title: 'Siswa',
        url: '/admin/data/siswa'
      },

    ]
  }
]

const ItemSidebar = () => {
  const router = useRouter()

  return (
    <div className='w-full'>
      <div className='flex flex-col pl-[30px] w-full'>
        {adminItems.map((item, idx) => {
          return (
            <div className="mt-[20px]" key={idx}>
              <Heading size={'md'}>{item.heading}</Heading>
              <div className='flex flex-col mt-[10px] gap-[10px]'>
                {item.menu.map((itm, ind) => (
                  <div key={ind}>
                    <Feature
                      icon={
                        <Icon as={itm.icon} color={itm.url == router.pathname ? 'orange.500' : 'orange.200'} w={5} h={5} />
                      }
                      url={itm.url}
                      active={itm.url == router.pathname}
                      iconBg={itm.url == router.pathname && 'orange.200'}
                      text={itm.title}
                    />
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ItemSidebar;