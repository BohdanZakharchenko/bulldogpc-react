// ClientOrdersPage.tsx 
import React from 'react';
import ClientOrders from '../../components/clientComponents/ClientOrders';

function ClientOrdersPage() {
  return (
    <div>
      <h1>Ваші заявки на ремонт</h1>
      <ClientOrders />
    </div>
  );
}

export default ClientOrdersPage;
