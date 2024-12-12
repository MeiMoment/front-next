"use client";
import { useState, useEffect } from "react";
import { Table, Card, Button, Input, Space, Tag, Modal, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  SearchOutlined,
  ReloadOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { ajaxWithLogin } from "@/utils/request";

interface CustomerData {
  id: number;
  name: string;
  age: number;
  whatsApp: string;
  phone: string;
  experience: string;
  amount: string;
  group: string;
  ip: string;
  country: string;
  device: string;
  address: string;
  channel: string;
  local_time: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface CustomerResponse {
  items: CustomerData[];
  total: number;
}

export default function CustomersPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CustomerData[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    name: "",
    group: "",
    country: "",
    channel: "",
    dateRange: [null, null] as [Date | null, Date | null],
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize]);

  const fetchData = async (searchParams?: any) => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
        ...searchParams,
      };

      const { data } = await ajaxWithLogin.get<CustomerResponse>(
        "/customers/page",
        {
          params,
        }
      );
      setData(data.items);
      setTotal(data.total);
    } catch (error) {
      message.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const searchParams: Record<string, any> = {};

    if (filters.name) {
      searchParams.name = filters.name;
    }
    if (filters.group) {
      searchParams.group = filters.group;
    }
    if (filters.country) {
      searchParams.country = filters.country;
    }
    if (filters.channel) {
      searchParams.channel = filters.channel;
    }
    if (filters.dateRange[0] && filters.dateRange[1]) {
      searchParams.startDate = filters.dateRange[0].toISOString();
      searchParams.endDate = filters.dateRange[1].toISOString();
    }

    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchData(searchParams);
  };

  const handleDelete = async (record: CustomerData) => {
    Modal.confirm({
      title: "Confirm Delete",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete customer "${record.name}"? This action cannot be undone.`,
      okText: "Confirm",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await ajaxWithLogin.delete(`/customers/${record.id}`);
          message.success("Successfully deleted");
          fetchData();
        } catch (error) {
          message.error("Failed to delete");
        }
      },
    });
  };

  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Please select customers to delete");
      return;
    }

    Modal.confirm({
      title: "Confirm Batch Delete",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete ${selectedRowKeys.length} selected customers? This action cannot be undone.`,
      okText: "Confirm",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await ajaxWithLogin.delete("/customers/batch", {
            data: { ids: selectedRowKeys },
          });
          message.success("Batch delete successful");
          setSelectedRowKeys([]);
          fetchData();
        } catch (error) {
          message.error("Batch delete failed");
        }
      },
    });
  };

  const columns: ColumnsType<CustomerData> = [
    {
      title: "Customer Name",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      width: 150,
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      width: 80,
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "WhatsApp",
      dataIndex: "whatsApp",
      key: "whatsApp",
      width: 150,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: 150,
    },
    {
      title: "Trading Experience",
      dataIndex: "experience",
      key: "experience",
      width: 120,
      render: (experience) => (
        <Tag
          color={
            experience === "Expert"
              ? "green"
              : experience === "Intermediate"
              ? "blue"
              : "orange"
          }
        >
          {experience}
        </Tag>
      ),
    },
    {
      title: "Investment Amount",
      dataIndex: "amount",
      key: "amount",
      width: 120,
    },
    {
      title: "Customer Group",
      dataIndex: "group",
      key: "group",
      width: 300,
      render: (group) => (
        <Tag
          color={
            group === "VIP" ? "gold" : group === "Regular" ? "blue" : "default"
          }
        >
          {group}
        </Tag>
      ),
    },
    {
      title: "IP Address",
      dataIndex: "ip",
      key: "ip",
      width: 150,
    },
    {
      title: "Country/Region",
      dataIndex: "country",
      key: "country",
      width: 120,
    },
    {
      title: "Device",
      dataIndex: "device",
      key: "device",
      width: 100,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: 200,
    },
    {
      title: "Local Time",
      dataIndex: "local_time",
      key: "local_time",
      width: 180,
    },
    {
      title: "Actions",
      key: "action",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Card
      title="Customer Query"
      extra={
        <Space>
          {selectedRowKeys.length > 0 && (
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleBatchDelete}
            >
              Batch Delete
            </Button>
          )}
          <Button
            icon={<ReloadOutlined />}
            onClick={() => fetchData()}
            loading={loading}
          />
        </Space>
      }
    >
      <Space direction="vertical" size="middle" className="w-full">
        <Space wrap>
          <Input
            placeholder="Search customer name"
            allowClear
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          />
          <Button type="primary" onClick={handleSearch}>
            Search
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          scroll={{ x: 2600 }}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys as number[]),
          }}
          pagination={{
            ...pagination,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: (page, pageSize) => {
              setPagination({ current: page, pageSize });
            },
          }}
        />
      </Space>
    </Card>
  );
}
