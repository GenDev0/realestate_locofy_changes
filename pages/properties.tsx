import type { NextPage } from "next";
import "antd/dist/antd.min.css";
import { Pagination, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";
import Header from "../components/header";
import PropertiesGridContainer from "../components/properties-grid-container";
import Footer from "../components/footer";
import Image from "next/image";
import { PostgrestSingleResponse, createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export type Properties = {
  id: number;
  createdAt: Date | null;
  name: string;
  image: string;
  price: number;
};

const defaultOrder = [
  {
    key: "1",
    label: <a onClick={(e) => e.preventDefault()}>Popular Properties</a>,
  },
  {
    key: "2",
    label: <a onClick={(e) => e.preventDefault()}>Latest Properties</a>,
  },
  {
    key: "3",
    label: <a onClick={(e) => e.preventDefault()}>Recommanded Properties</a>,
  },
];

const PropertiesGridView: NextPage = () => {
  const client = createClient(
    process.env.NEXT_PUBLIC_URL!,
    process.env.NEXT_PUBLIC_KEY!
  );
  const [properties, setProperties] = useState<Properties[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const result: PostgrestSingleResponse<Properties[]> = await client
          .from("properties")
          .select("*");
        if (result) {
          setProperties(result?.data!);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchProperties();
  }, []);

  return (
    <div className='bg-gray-white w-full flex flex-col items-center justify-start text-center text-33xl text-gray-white font-body-regular-400'>
      <Header hamburger={false} />
      <div className='self-stretch h-60 flex flex-col items-center justify-center bg-[url(/category@3x.png)] bg-cover bg-no-repeat bg-top'>
        <div className='flex flex-col items-center justify-start gap-[12px]'>
          <div className='leading-[72px] font-semibold'>Properties</div>
          <div className='text-base leading-[24px] text-whitesmoke-200 font-body-regular-600'>
            <span>{`Home / `}</span>
            <span className='font-medium text-gray-white'>Properties</span>
          </div>
        </div>
      </div>
      <div className='flex flex-col pt-16 pb-2 items-center justify-start gap-[95px] text-left text-base text-gray-black font-body-regular-600 lg:pl-[120px] lg:pr-[120px]'>
        <div className='flex flex-row items-center justify-start'>
          <div className='flex flex-row flex-wrap items-end justify-start gap-[16px]'>
            <div className='flex flex-row items-start justify-start gap-[8px]'>
              <Image
                width={100}
                height={100}
                className='w-6 h-6'
                alt=''
                src='/listbullets.svg'
              />
              <Image
                width={100}
                height={100}
                className='w-6 h-6'
                alt=''
                src='/squaresfour.svg'
              />
            </div>
            <div className='leading-[24px]'>Sort by:</div>
            <Dropdown
              menu={{ items: defaultOrder }}
              placement='bottomLeft'
              trigger={["hover"]}
            >
              <a onClick={(e) => e.preventDefault()}>
                {`Default Order `}
                <DownOutlined />
              </a>
            </Dropdown>
          </div>
        </div>
        <PropertiesGridContainer allProperties={properties} />
        <div className='flex flex-row items-end justify-center gap-[8px] text-center text-primary-500'>
          <Pagination defaultCurrent={1} total={50} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PropertiesGridView;
