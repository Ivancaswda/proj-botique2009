import React, {useContext} from 'react'
import {ShopContext} from "../context/ShopContext.jsx";
import LazyLoad from "react-lazyload";


const Orders = () => {

    const {products, currency } = useContext(ShopContext)
    let productsCopy = products.slice(0, 4)
    const today = new Date()
    const {delOption, setDelOption} = useContext(ShopContext)
    return (
        <div className='border-t pt-16'>
            <div className='text-2xl'>
                <h1>Мои заказы</h1>
            </div>

            <div>
                {productsCopy.map((item, index) => (
                    <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                        <div className='flex items-start gap-6  text-sm'>
                            <LazyLoad>

                            <img className='w-22 sm:w-25' src={item.image[0]} alt=""/>

                            </LazyLoad>
                        </div>
                        <div className='w-50'>
                            <p className='sm:text-base font-medium'>{item.name}</p>
                            <div className='flex items-center gap-3 mt-2 text-base text-color text-gray-700'>
                                <b className='text-lg'>{item.price}{currency}</b>
                                <p>Количествo: 2</p>
                                <p>Возврат: 11дней</p>
                            </div>
                            <p className='mt-2'>Дата: <span className='text-gray-400'>{today.getDay()}</span><span
                                className='text-gray-400'>.{today.getMonth()}</span><span
                                className='text-gray-400'>.{(today.getFullYear())}</span></p>
                        </div>
                        <div className='md:w-1/2 flex justify-between'>
                            <div className='flex items-center gap-2'>
                                <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                                <p className='text-sm text-base'>Готов к отправке</p>
                            </div>
                        </div>
                        <button className='border px-4 py-2 text-sm font-medium rounded-lg'>Отслеживать доставку ({delOption})</button>
                    </div>


                ))}

            </div>
        </div>
    )
}
export default Orders
