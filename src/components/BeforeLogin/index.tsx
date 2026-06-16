import React from 'react'

export const BeforeLogin: React.FC = () => {
  return (
    <div>
      <p>
        <b>Добре дошъл в админ панела!</b>
        {' Оттук администраторите управляват магазина. Клиентите трябва да '}
        <a href={`${process.env.PAYLOAD_PUBLIC_SERVER_URL}/login`}>влизат през сайта</a>
        {' , за да достъпват профила си, историята на поръчките и останалите клиентски функции.'}
      </p>
    </div>
  )
}
