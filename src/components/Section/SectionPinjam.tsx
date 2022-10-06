import { NextPage } from "next";
import { Badge, Button, Container, Divider, Flex, FormControl, FormLabel, Heading, Image, Input, SimpleGrid, Stack, Table, Tbody, Td, Text, Textarea, Th, Thead, Tr } from '@chakra-ui/react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Link from "next/link";

const BookItem = ({ image, title, id, desc, type }: any) => {
  const selectType = (type: any) => {
    if (type == 'IPA') {
      return 'orange.200'
    }
    if (type == 'Matematika') {
      return 'blue.200'
    }
  }
  return (
    <Link href={`/pinjam/buku/${id}`}>
      <Flex
        className="hover:scale-[1.02] transition-all active:scale-100" gap={2} flexDirection={'column'} shadow={'sm'} cursor={'pointer'} rounded={5} alignItems={'center'} p={{ base: 6, lg: 3 }}
        bg={selectType(type)}
        width={{ base: '250px', sm: '250px', lg: '140px' }} height={{ base: '400px', lg: '200px' }}>
        <Image
          rounded={3}
          height={{ base: '260px', lg: '120px' }}
          width={{ base: '300px', lg: '100px' }}
          minHeight={120}
          alt={'feature image'}
          src={
            image
          }
          objectFit={'cover'} />
        <div className="w-full mt-3 sm:mt-2">
          <Text fontWeight={'bold'} fontSize={12}>{title}</Text>
          <Text height={30} overflow='hidden' textAlign={'left'} fontSize={10}>{desc}</Text>
        </div>
      </Flex>
    </Link>
  )
}

const SectionPinjam: NextPage = () => {
  return (
    <Container maxW={'5xl'} py={10}>
      <Heading mb={10}>List Buku Perpustakaan</Heading>
      <Stack>
        <Heading size={'md'}>Buku IPA</Heading>
        {/* item */}
        <Carousel
          additionalTransfrom={0}
          arrows
          autoPlaySpeed={3000}
          centerMode={false}
          containerClass="container-with-dots"
          draggable
          focusOnSelect={false}
          infinite
          keyBoardControl
          minimumTouchDrag={80}
          pauseOnHover
          renderArrowsWhenDisabled={false}
          renderButtonGroupOutside={false}
          renderDotsOutside={false}
          responsive={{
            desktop: {
              breakpoint: {
                max: 3000,
                min: 1024
              },
              items: 6,
              partialVisibilityGutter: 40
            },
            mobile: {
              breakpoint: {
                max: 464,
                min: 0
              },
              items: 1,
              partialVisibilityGutter: 30
            },
            tablet: {
              breakpoint: {
                max: 1024,
                min: 464
              },
              items: 2,
              partialVisibilityGutter: 30
            }
          }}
          rewind={false}
          rewindWithAnimation={false}
          rtl={false}
          shouldResetAutoplay
          showDots={false}
          itemClass='flex items-center justify-center'
          slidesToSlide={1}
          swipeable
        >
          <BookItem
            type="IPA"
            id='1'
            image={'https://images.unsplash.com/photo-1554200876-56c2f25224fa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
            title='Biologi'
            desc='Buku yang belajar tentang biologi. Buku yang belajar tentang biologi. Buku yang belajar tentang biologi.'
          />
          <BookItem
            type="IPA"
            id='1'
            image={'https://images.unsplash.com/photo-1554200876-56c2f25224fa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
            title='Biologi'
            desc='Buku yang belajar tentang biologi. Buku yang belajar tentang biologi. Buku yang belajar tentang biologi.'
          />
          <BookItem
            type="IPA"
            id='1'
            image={'https://images.unsplash.com/photo-1554200876-56c2f25224fa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
            title='Biologi'
            desc='Buku yang belajar tentang biologi. Buku yang belajar tentang biologi. Buku yang belajar tentang biologi.'
          />
          <BookItem
            type="IPA"
            id='1'
            image={'https://images.unsplash.com/photo-1554200876-56c2f25224fa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
            title='Biologi'
            desc='Buku yang belajar tentang biologi. Buku yang belajar tentang biologi. Buku yang belajar tentang biologi.'
          />
          <BookItem
            type="IPA"
            id='1'
            image={'https://images.unsplash.com/photo-1554200876-56c2f25224fa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
            title='Biologi'
            desc='Buku yang belajar tentang biologi. Buku yang belajar tentang biologi. Buku yang belajar tentang biologi.'
          />
          <BookItem
            type="IPA"
            id='1'
            image={'https://images.unsplash.com/photo-1554200876-56c2f25224fa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
            title='Biologi'
            desc='Buku yang belajar tentang biologi. Buku yang belajar tentang biologi. Buku yang belajar tentang biologi.'
          />
          <BookItem
            type="IPA"
            id='1'
            image={'https://images.unsplash.com/photo-1554200876-56c2f25224fa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
            title='Biologi'
            desc='Buku yang belajar tentang biologi. Buku yang belajar tentang biologi. Buku yang belajar tentang biologi.'
          />
          <BookItem
            type="IPA"
            id='1'
            image={'https://images.unsplash.com/photo-1554200876-56c2f25224fa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
            title='Biologi'
            desc='Buku yang belajar tentang biologi. Buku yang belajar tentang biologi. Buku yang belajar tentang biologi.'
          />
          <BookItem
            type="IPA"
            id='1'
            image={'https://images.unsplash.com/photo-1554200876-56c2f25224fa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
            title='Biologi'
            desc='Buku yang belajar tentang biologi. Buku yang belajar tentang biologi. Buku yang belajar tentang biologi.'
          />
          <BookItem
            type="IPA"
            id='1'
            image={'https://images.unsplash.com/photo-1554200876-56c2f25224fa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
            title='Biologi'
            desc='Buku yang belajar tentang biologi. Buku yang belajar tentang biologi. Buku yang belajar tentang biologi.'
          />
          <BookItem
            type="IPA"
            id='1'
            image={'https://images.unsplash.com/photo-1554200876-56c2f25224fa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
            title='Biologi'
            desc='Buku yang belajar tentang biologi. Buku yang belajar tentang biologi. Buku yang belajar tentang biologi.'
          />
        </Carousel>
      </Stack>
      <Divider my={5}></Divider>
      <Stack>
        <Heading size={'md'}>Buku Matematika</Heading>
        <Carousel
          additionalTransfrom={0}
          arrows
          autoPlaySpeed={3000}
          centerMode={false}
          containerClass="container-with-dots"
          draggable
          focusOnSelect={false}
          infinite
          keyBoardControl
          minimumTouchDrag={80}
          pauseOnHover
          renderArrowsWhenDisabled={false}
          renderButtonGroupOutside={false}
          renderDotsOutside={false}
          responsive={{
            desktop: {
              breakpoint: {
                max: 3000,
                min: 1024
              },
              items: 6,
              partialVisibilityGutter: 40
            },
            mobile: {
              breakpoint: {
                max: 464,
                min: 0
              },
              items: 1,
              partialVisibilityGutter: 30
            },
            tablet: {
              breakpoint: {
                max: 1024,
                min: 464
              },
              items: 2,
              partialVisibilityGutter: 30
            }
          }}
          rewind={false}
          rewindWithAnimation={false}
          rtl={false}
          shouldResetAutoplay
          showDots={false}
          itemClass='flex items-center justify-center'
          slidesToSlide={1}
          swipeable
        >
          <BookItem
            type="Matematika"
            id='1'
            image={'https://images.unsplash.com/photo-1554200876-56c2f25224fa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
            title='Perkalian'
            desc='Buku yang belajar tentang perkalian. Buku yang belajar tentang perkalian. Buku yang belajar tentang perkalian.'
          />
          <BookItem
            type="Matematika"
            id='1'
            image={'https://images.unsplash.com/photo-1554200876-56c2f25224fa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
            title='Perkalian'
            desc='Buku yang belajar tentang perkalian. Buku yang belajar tentang perkalian. Buku yang belajar tentang perkalian.'
          />
          <BookItem
            type="Matematika"
            id='1'
            image={'https://images.unsplash.com/photo-1554200876-56c2f25224fa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
            title='Perkalian'
            desc='Buku yang belajar tentang perkalian. Buku yang belajar tentang perkalian. Buku yang belajar tentang perkalian.'
          />
          <BookItem
            type="Matematika"
            id='1'
            image={'https://images.unsplash.com/photo-1554200876-56c2f25224fa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
            title='Perkalian'
            desc='Buku yang belajar tentang perkalian. Buku yang belajar tentang perkalian. Buku yang belajar tentang perkalian.'
          />
          <BookItem
            type="Matematika"
            id='1'
            image={'https://images.unsplash.com/photo-1554200876-56c2f25224fa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
            title='Perkalian'
            desc='Buku yang belajar tentang perkalian. Buku yang belajar tentang perkalian. Buku yang belajar tentang perkalian.'
          />
          <BookItem
            type="Matematika"
            id='1'
            image={'https://images.unsplash.com/photo-1554200876-56c2f25224fa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
            title='Perkalian'
            desc='Buku yang belajar tentang perkalian. Buku yang belajar tentang perkalian. Buku yang belajar tentang perkalian.'
          />
          <BookItem
            type="Matematika"
            id='1'
            image={'https://images.unsplash.com/photo-1554200876-56c2f25224fa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
            title='Perkalian'
            desc='Buku yang belajar tentang perkalian. Buku yang belajar tentang perkalian. Buku yang belajar tentang perkalian.'
          />
          <BookItem
            type="Matematika"
            id='1'
            image={'https://images.unsplash.com/photo-1554200876-56c2f25224fa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
            title='Perkalian'
            desc='Buku yang belajar tentang perkalian. Buku yang belajar tentang perkalian. Buku yang belajar tentang perkalian.'
          />
          <BookItem
            type="Matematika"
            id='1'
            image={'https://images.unsplash.com/photo-1554200876-56c2f25224fa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
            title='Perkalian'
            desc='Buku yang belajar tentang perkalian. Buku yang belajar tentang perkalian. Buku yang belajar tentang perkalian.'
          />

        </Carousel>
      </Stack>
    </Container>
  )
}

export default SectionPinjam
