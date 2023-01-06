import {Link, Page, Card, DataTable, Button, Select } from '@shopify/polaris';
import React, { useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";

export function ProductTable({ Tags }) {
  
  let navigate = useNavigate(); 
  const [selected, setSelected] = useState('');
  const handleSelectChange = useCallback((e, value) => {
    console.log('e.target :>> ', e.target);
    console.log('value :>> ', value);
    setSelected(value)
  }, []);

  const options = () => {
    let arr = [];
    for(let i=0; i< Tags.length; i++) {
      let obj = {};
      obj.label = `priority-${i}`;
      obj.value = `priority-${i}`;
      arr.push(obj)
    }
    return arr;
  }
  

  return (
    <Page title="Sales by product">
      <Card>
        <DataTable
          columnContentTypes={[
            'text',
            'numeric',
            'text',
            'text',
          ]}
          headings={['Tag Name', 'Total Product', 'Created At', 'Updated At', 'Pririty Set', '', '']}
          rows={Tags.map((item, index) => {
            const tagName = (
              <Link onClick={() => {
                let path = `selecteddetails`; 
                navigate(path);
              }}>
                <p>
                  { item }
                </p>
              </Link>
            );
            const quantity = (
              // <p key={item.quantity}>{ item.quantity }</p>
              <p>0</p>
            )
            const buttonDelete = (
              <Button destructive onClick={() => {
                console.log('object :>> ', index);
              }}>Delete Set</Button>
            )
            const buttonAdd = (
              <Button primary onClick={() => {
                console.log('object :>> ', index);
                // const result = option();
                // console.log('result :>> ', result);
              }}>Edit</Button>
            )
            
            const priority =
              (
                <Select
                  // label="Date range"
                  options={options()}
                  onChange={handleSelectChange}
                  value={selected}
                />
              )
            return [tagName, quantity, '6/1/2023', '6/1/2023', priority, buttonAdd, buttonDelete];
          })}
        />
      </Card>
    </Page>
  );
}