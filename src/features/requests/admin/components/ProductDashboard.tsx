"use client";

import React, { useEffect, useState } from "react";
import { FloatButton, message, Space, Table } from "antd";

import { ColumnsType } from "antd/es/table";

import { IProduct } from "../type";
import Loading from "@/features/shared/components/loading";
import Image from "next/image";
import { getImagePath } from "@/features/shared/helpers/upload";
import DeleteButton from "@/features/shared/components/dashboard/delete-button";
import EditButton from "@/features/shared/components/dashboard/edit-button";
import { IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
const ProductDashBoard: React.FC = () => {
  const [isLoading, setLoading] = useState(true);
  const [products, setProducts] = useState<IProduct[]>([]);
  const router = useRouter();

  const handleDelete = async (name: string, slug: string) => {
    const res = await fetch(`/api/admin/products/${slug}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      message.error(`Error while deleting: ${name}`);
      return;
    }

    setProducts((products) => products.filter((p) => p.slug !== slug));
    message.success(`Deleted ${name} successfully`);
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/products");

      setProducts(await (res.json() as Promise<IProduct[]>));
      setLoading(false);
    };

    fetchData();
  }, []);

  const columns: ColumnsType<IProduct> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <>
          <Image
            src={getImagePath(image) || "/assets/no-image.png"}
            alt="product-img"
            width={50}
            height={50}
          />
        </>
      ),
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "quantity",
      render: (quantity: number) => <>{renderTag(quantity)}</>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record: IProduct) => {
        return (
          <Space size="middle">
            <EditButton href={`/dashboard/products/edit/${record.slug}`} />
            <DeleteButton
              handleDelete={() => handleDelete(record.name, record.slug)}
            />
          </Space>
        );
      },
    },
  ];

  if (isLoading) return <Loading />;

  return (
    <div className="dashboard-product">
      <h4 className="-title">Product Dashboard</h4>
      <FloatButton
        tooltip="Add new product"
        type="primary"
        shape="circle"
        icon={
          <div className="flex justify-center items-center">
            <IconPlus width={30} height={30} />
          </div>
        }
        onClick={() => router.push("/dashboard/products/create")}
      />

      <Table columns={columns} dataSource={products} rowKey="id" />
    </div>
  );
};

export default ProductDashBoard;