import { useQuery } from '@tanstack/react-query';
import React, { FC } from 'react';
import axios from '../../Api/axios';
import { useParams } from 'react-router-dom';

const OrderInfo = () => {
    const { id } = useParams();
    const {
        data: selectedOrder,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ['get-orders-id',id],
        queryFn: async () => {
            const { data } = await axios.get(`/orders/${id}`);
            return data?.data;
        },
        enabled:!!id
    });
// console.log(selectedOrder)
    return (
        <div>
            {selectedOrder && (
                <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full  overflow-y-auto p-6 relative">
                    <h2 className="text-xl font-semibold mb-4">Order #{selectedOrder.id}</h2>

                    <div className="space-y-3 text-sm">
                        <p>
                            <strong>Status:</strong> {selectedOrder.status}
                        </p>
                        <p>
                            <strong>User:</strong> {selectedOrder.user?.name} ({selectedOrder.user?.email})
                        </p>
                        <p>
                            <strong>Payment Info:</strong> {selectedOrder.payment_info || 'N/A'}
                        </p>
                        <p>
                            <strong>Final Invoice:</strong> {selectedOrder.final_invoice || 'N/A'}
                        </p>
                        <p>
                            <strong>Final Proposal:</strong> {selectedOrder.final_proposal || 'N/A'}
                        </p>

                        <div>
                            <h3 className="font-semibold mt-4">Shipment Files:</h3>
                            <ul className="list-disc ml-6">
                                {selectedOrder.shipmentFiles?.map((file: any) => (
                                    <li key={file.id}>
                                        <a href={`/${file.shipment_file}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                            File #{file.id}
                                        </a>
                                    </li>
                                )) || <p>No files</p>}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mt-4">Containers:</h3>
                            <ul className="list-disc ml-6 space-y-4">
                                {selectedOrder.containers?.map((container: any) => (
                                    <li key={container.id}>
                                        <p>
                                            <strong>Boxes:</strong> {container.box_count}, <strong>Total Weight:</strong> {container.total_weight}
                                        </p>

                                        {container.product_ids?.length ? (
                                            <ul className="ml-6 list-decimal space-y-2 mt-2">
                                                {container.product_ids.map((productItem: any) => (
                                                    <li key={productItem.id}>
                                                        <p>
                                                            <strong>Product Code:</strong> {productItem.product?.product_code}
                                                        </p>
                                                        <p>
                                                            <strong>Quantity:</strong> {productItem.quantity}
                                                        </p>
                                                        <p>
                                                            <strong>Box Dimensions:</strong> {productItem.box_dimensions}
                                                        </p>
                                                        <p>
                                                            <strong>Standard Weight:</strong> {productItem.standard_weight}
                                                        </p>
                                                        {productItem.image && <img src={`${import.meta.env.VITE_BASE_URL}/${productItem.image}`} alt="Product" className="w-32 mt-2 rounded border" />}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-500 ml-4">No products in this container.</p>
                                        )}
                                    </li>
                                )) || <p>No containers</p>}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderInfo;
