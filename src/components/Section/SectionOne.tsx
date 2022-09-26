import {
  Container,
  SimpleGrid,
  Image,
  Flex,
  Heading,
  Text,
  Stack,
  StackDivider,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  IoLibraryOutline,
  IoPeopleOutline,
  IoSearchSharp,
} from 'react-icons/io5';
import { ReactElement } from 'react';
import { NextPage } from 'next';
import { Swiper, SwiperSlide } from "swiper/react";

import 'swiper/css';
import 'swiper/css/pagination';

import { Autoplay, Pagination } from "swiper";



interface FeatureProps {
  text: string;
  iconBg: string;
  icon?: ReactElement;
}

const Feature = ({ text, icon, iconBg }: FeatureProps) => {
  return (
    <Stack direction={'row'} align={'center'}>
      <Flex
        w={8}
        h={8}
        align={'center'}
        justify={'center'}
        rounded={'full'}
        bg={iconBg}>
        {icon}
      </Flex>
      <Text fontWeight={600}>{text}</Text>
    </Stack>
  );
};

const SectionOne: NextPage = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };
  return (
    <Container maxW={'5xl'} py={12} mt={{base: 0, md: 10}}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        <Stack spacing={4}>
          <Text
            textTransform={'uppercase'}
            color={'orange.400'}
            fontWeight={600}
            fontSize={'sm'}
            bg={useColorModeValue('orange.100', 'orange.900')}
            p={2}
            alignSelf={'flex-start'}
            rounded={'md'}>
            SMA NEGERI 1 BATI-BATI
          </Text>
          <Heading>Website Pelayan Sekolah</Heading>
          <Text color={'gray.500'} fontSize={'lg'}>
            Selamat datang, semoga website ini bermanfaat bagi masyarakat SMA Negeri 1 Bati-Bati.
          </Text>
          <Stack
            spacing={4}
            divider={
              <StackDivider
                borderColor={useColorModeValue('gray.100', 'gray.700')}
              />
            }>
            <Feature
              icon={
                <Icon as={IoPeopleOutline} color={'yellow.500'} w={5} h={5} />
              }
              iconBg={useColorModeValue('yellow.100', 'yellow.900')}
              text={'Bimbingan'}
            />
            <Feature
              icon={<Icon as={IoLibraryOutline} color={'green.500'} w={5} h={5} />}
              iconBg={useColorModeValue('green.100', 'green.900')}
              text={'Peminjaman Buku'}
            />
            <Feature
              icon={
                <Icon as={IoSearchSharp} color={'purple.500'} w={5} h={5} />
              }
              iconBg={useColorModeValue('purple.100', 'purple.900')}
              text={'Pusat Informasi'}
            />
          </Stack>
        </Stack>
        <Flex>
          <Swiper
            spaceBetween={50}
            pagination={{ clickable: true }}
            modules={[Pagination, Autoplay]}
            className="mySwiper rounded-lg"
          >
            <SwiperSlide>
              <Image
                rounded={8}
                alt={'feature image'}
                src={
                  'https://images.unsplash.com/photo-1554200876-56c2f25224fa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
                }
                objectFit={'cover'}
              />
            </SwiperSlide>
            <SwiperSlide>
              <Image
                rounded={8}
                alt={'feature image'}
                src={
                  'https://images.unsplash.com/photo-1554200876-56c2f25224fa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
                }
                objectFit={'cover'}
              />
            </SwiperSlide>
            <SwiperSlide>
              <Image
                rounded={8}
                alt={'feature image'}
                src={
                  'https://images.unsplash.com/photo-1554200876-56c2f25224fa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
                }
                objectFit={'cover'}
              />
            </SwiperSlide>
          </Swiper>

        </Flex>
      </SimpleGrid>
    </Container>
  );
}

export default SectionOne;