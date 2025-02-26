'use client';

import React, { useEffect, useState } from 'react';
import { request } from 'graphql-request';
import { gql } from 'graphql-request';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const INTROSPECTION_QUERY = gql`
  query IntrospectionQuery {
    __schema {
      types {
        name
        kind
        description
        fields(includeDeprecated: true) {
          name
          description
          args {
            name
            description
            type {
              name
              kind
            }
            defaultValue
          }
          type {
            name
            kind
            ofType {
              name
              kind
              ofType {
                name
                kind
              }
            }
          }
        }
      }
    }
  }
`;

const COLLECTION_TYPE_QUERY = gql`
  query CollectionTypeQuery {
    __type(name: "Collection") {
      name
      kind
      description
      fields {
        name
        description
        args {
          name
          description
          type {
            name
            kind
            ofType {
              name
              kind
            }
          }
          defaultValue
        }
        type {
          name
          kind
          ofType {
            name
            kind
          }
        }
      }
    }
  }
`;

const CATEGORY_TYPE_QUERY = gql`
  query CategoryTypeQuery {
    __type(name: "Category") {
      name
      kind
      description
      fields {
        name
        description
        args {
          name
          description
          type {
            name
            kind
            ofType {
              name
              kind
            }
          }
          defaultValue
        }
        type {
          name
          kind
          ofType {
            name
            kind
          }
        }
      }
    }
  }
`;

const MENU_TYPE_QUERY = gql`
  query MenuTypeQuery {
    __type(name: "Menu") {
      name
      kind
      description
      fields {
        name
        description
        args {
          name
          description
          type {
            name
            kind
            ofType {
              name
              kind
            }
          }
          defaultValue
        }
        type {
          name
          kind
          ofType {
            name
            kind
          }
        }
      }
    }
  }
`;

// 定义GraphQL内省查询响应的类型
type TypeFieldArg = {
  name: string;
  description?: string;
  type: {
    name?: string;
    kind: string;
    ofType?: {
      name?: string;
      kind: string;
    };
  };
  defaultValue?: string;
};

type TypeField = {
  name: string;
  description?: string;
  args?: TypeFieldArg[];
  type: {
    name?: string;
    kind: string;
    ofType?: {
      name?: string;
      kind: string;
    };
  };
};

// 合并两个TypeInfo定义为一个完整的定义
type TypeInfo = {
  name: string;
  kind: string;
  description?: string;
  fields?: Array<{
    name: string;
    description?: string;
    args?: Array<{
      name: string;
      description?: string;
      type: {
        name?: string;
        kind: string;
        ofType?: {
          name?: string;
          kind: string;
        };
      };
      defaultValue?: string;
    }>;
    type: {
      name?: string;
      kind: string;
      ofType?: {
        name?: string;
        kind: string;
      };
    };
  }>;
};

// 定义GraphQL查询响应类型
type IntrospectionQueryResponse = {
  __type: TypeInfo;
};

export default function ApiIntrospection() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuTypeInfo, setMenuTypeInfo] = useState<TypeInfo | null>(null);
  const [categoryTypeInfo, setCategoryTypeInfo] = useState<TypeInfo | null>(null);
  const [collectionTypeInfo, setCollectionTypeInfo] = useState<TypeInfo | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const runIntrospectionQuery = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const endpoint = process.env.NEXT_PUBLIC_API_URI || 'https://api.example.com/graphql/';
      console.log('Running introspection query on:', endpoint);
      
      const startTime = Date.now();
      
      // 查询Collection类型
      const collectionData = await request<IntrospectionQueryResponse>(endpoint, COLLECTION_TYPE_QUERY);
      setCollectionTypeInfo(collectionData.__type);
      
      // 查询Category类型
      const categoryData = await request<IntrospectionQueryResponse>(endpoint, CATEGORY_TYPE_QUERY);
      setCategoryTypeInfo(categoryData.__type);
      
      // 查询Menu类型
      const menuData = await request<IntrospectionQueryResponse>(endpoint, MENU_TYPE_QUERY);
      setMenuTypeInfo(menuData.__type);
      
      const queryTimeMs = Date.now() - startTime;
      
      setDebugInfo({
        endpoint,
        queryTimeMs,
        hasCollectionData: !!collectionData?.__type,
        hasCategoryData: !!categoryData?.__type,
        hasMenuData: !!menuData?.__type
      });
      
      console.log('Introspection completed:', {
        collection: collectionData,
        category: categoryData,
        menu: menuData
      });
      
    } catch (err: any) {
      console.error('Error running introspection query:', err);
      
      setError(err.message || '内省查询失败');
      setDebugInfo({
        endpoint: process.env.NEXT_PUBLIC_API_URI,
        error: err.message,
        graphqlErrors: err.response?.errors || [],
        statusCode: err.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  // 检查字段是否有特定参数
  const hasArg = (field: any, argName: string) => {
    return field?.args?.some((arg: any) => arg.name === argName) || false;
  };

  // 渲染字段信息
  const renderFieldInfo = (field: any) => (
    <div key={field.name} className="mb-4 border-b pb-2">
      <div className="flex justify-between">
        <h3 className="font-medium text-blue-800">{field.name}</h3>
        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
          {field.type.kind === 'NON_NULL' 
            ? `${field.type.ofType?.name || field.type.ofType?.kind}!` 
            : field.type.name || field.type.kind}
        </span>
      </div>
      {field.description && (
        <p className="text-sm text-gray-600 mt-1">{field.description}</p>
      )}
      {field.args && field.args.length > 0 && (
        <div className="mt-2">
          <p className="text-xs font-medium">参数:</p>
          <div className="ml-2 mt-1">
            {field.args.map((arg: any) => (
              <div key={arg.name} className="text-xs flex items-start mb-1">
                <span className="font-mono bg-gray-50 px-1 rounded mr-1">{arg.name}</span>
                <span className="text-gray-500">
                  : {arg.type.ofType?.name || arg.type.name || arg.type.kind}
                  {arg.defaultValue && ` = ${arg.defaultValue}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>GraphQL API 内省查询</CardTitle>
            <p className="text-sm text-muted-foreground">
              此工具查询Saleor GraphQL API结构，获取菜单系统相关类型的信息
            </p>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Button 
                onClick={runIntrospectionQuery} 
                disabled={loading}
                className="mb-4"
              >
                {loading ? '查询中...' : '运行内省查询'}
              </Button>
              
              {error && (
                <div className="p-4 border border-red-200 bg-red-50 text-red-800 rounded-md mb-4">
                  <h3 className="font-medium mb-2">查询错误</h3>
                  <p className="text-sm">{error}</p>
                  {debugInfo?.graphqlErrors?.length > 0 && (
                    <div className="mt-2 text-xs">
                      <p>GraphQL错误:</p>
                      <ul className="list-disc pl-5 mt-1">
                        {debugInfo.graphqlErrors.map((err: any, i: number) => (
                          <li key={i}>{err.message}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              {debugInfo && !error && (
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-md mb-4 text-xs">
                  <p className="font-medium text-blue-800">查询成功</p>
                  <p>端点: {debugInfo.endpoint}</p>
                  <p>查询时间: {debugInfo.queryTimeMs}ms</p>
                </div>
              )}
            </div>
            
            {(collectionTypeInfo || categoryTypeInfo || menuTypeInfo) && (
              <Tabs defaultValue="collection">
                <TabsList className="mb-4">
                  <TabsTrigger value="collection">Collection 类型</TabsTrigger>
                  <TabsTrigger value="category">Category 类型</TabsTrigger>
                  <TabsTrigger value="menu">Menu 类型</TabsTrigger>
                </TabsList>
                
                <TabsContent value="collection">
                  {collectionTypeInfo && (
                    <div>
                      <div className="mb-4">
                        <h2 className="text-lg font-bold mb-1">{collectionTypeInfo.name}</h2>
                        {collectionTypeInfo.description && (
                          <p className="text-gray-600">{collectionTypeInfo.description}</p>
                        )}
                      </div>
                      
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
                        <p className="font-medium text-amber-800">重要字段检查</p>
                        <p className="text-sm">
                          products字段
                          {collectionTypeInfo.fields?.some(f => f.name === 'products') 
                            ? ' 存在' 
                            : ' 不存在'}
                        </p>
                        
                        {collectionTypeInfo.fields?.find(f => f.name === 'products') && (
                          <div className="mt-2 text-sm">
                            <p>products字段支持的参数:</p>
                            <ul className="list-disc pl-5 mt-1">
                              {collectionTypeInfo.fields
                                .find(f => f.name === 'products')?.args
                                ?.map(arg => (
                                  <li key={arg.name}>{arg.name}</li>
                                ))}
                            </ul>
                            <p className="mt-2">
                              <strong>channel参数:</strong> 
                              {hasArg(collectionTypeInfo.fields.find(f => f.name === 'products'), 'channel') 
                                ? ' 支持' 
                                : ' 不支持'}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <ScrollArea className="h-[400px] border rounded-lg p-4">
                        {collectionTypeInfo.fields?.map(renderFieldInfo)}
                      </ScrollArea>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="category">
                  {categoryTypeInfo && (
                    <div>
                      <div className="mb-4">
                        <h2 className="text-lg font-bold mb-1">{categoryTypeInfo.name}</h2>
                        {categoryTypeInfo.description && (
                          <p className="text-gray-600">{categoryTypeInfo.description}</p>
                        )}
                      </div>
                      
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
                        <p className="font-medium text-amber-800">重要字段检查</p>
                        <p className="text-sm">
                          products字段
                          {categoryTypeInfo.fields?.some(f => f.name === 'products') 
                            ? ' 存在' 
                            : ' 不存在'}
                        </p>
                        
                        {categoryTypeInfo.fields?.find(f => f.name === 'products') && (
                          <div className="mt-2 text-sm">
                            <p>products字段支持的参数:</p>
                            <ul className="list-disc pl-5 mt-1">
                              {categoryTypeInfo.fields
                                .find(f => f.name === 'products')?.args
                                ?.map(arg => (
                                  <li key={arg.name}>{arg.name}</li>
                                ))}
                            </ul>
                            <p className="mt-2">
                              <strong>channel参数:</strong> 
                              {hasArg(categoryTypeInfo.fields.find(f => f.name === 'products'), 'channel') 
                                ? ' 支持' 
                                : ' 不支持'}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <ScrollArea className="h-[400px] border rounded-lg p-4">
                        {categoryTypeInfo.fields?.map(renderFieldInfo)}
                      </ScrollArea>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="menu">
                  {menuTypeInfo && (
                    <div>
                      <div className="mb-4">
                        <h2 className="text-lg font-bold mb-1">{menuTypeInfo.name}</h2>
                        {menuTypeInfo.description && (
                          <p className="text-gray-600">{menuTypeInfo.description}</p>
                        )}
                      </div>
                      
                      <ScrollArea className="h-[400px] border rounded-lg p-4">
                        {menuTypeInfo.fields?.map(renderFieldInfo)}
                      </ScrollArea>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 