import React, { useState, useEffect } from "react";

import MaterialTable from 'material-table';
import axios from 'axios'

export default function CustomEditComponent(props) {

  const [columns, setColumns] = useState([
    {
      title: 'Topic Name', field: 'topic',
      editComponent: props => (
        <input
          type="text"
          value={props.value}
          onChange={e => props.onChange(e.target.value)}
        />
      )
    },
    {
      title: 'Threshold Speed', field: 'threshold',
      editComponent: props => (
        <input
          type="text"
          value={props.value}
          onChange={e => props.onChange(e.target.value)}
        />
      )
    },
    {
      title: 'Rally name', field: 'rally',
      editComponent: props => (
        <input
          type="text"
          value={props.value}
          onChange={e => props.onChange(e.target.value)}
        />
      )
    },
    {
      title: 'Team name', field: 'team',
      editComponent: props => (
        <input
          type="text"
          value={props.value}
          onChange={e => props.onChange(e.target.value)}
        />
      )
    },
    {
      title: 'Cars participating', field: 'carId',
      editComponent: props => (
        <input
          type="text"
          value={props.value}
          onChange={e => props.onChange(e.target.value)}
        />
      )
    },
  
  ]);



  const [data, setData] = useState([]);


  
  useEffect(() => {


    const getStocksData = {
        url: 'http://localhost:5000/topic',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        // data: JSON.stringify(getStocksDataid)
    }
    axios(getStocksData)
        .then(response => {

            setData(response.data.data)

        })
        .catch(function (e) {

            console.log(e.message)
            if (e.message === 'Network Error') {
                alert("No Internet Found. Please check your internet connection")
            }
            else {
                alert("Sorry, something went wrong. Please try again after sometime. If the issue still persists contact support.")
            }

        });



}, []

)



  return (
    <MaterialTable
      title="Car rally Details"
      columns={columns}
      data={data}
      editable={{
        onRowAdd: newData =>
          new Promise((resolve, reject) => {
            setTimeout(() => {

              const getStocksData = {
                url: 'http://localhost:5000/topic',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify({
                  "topic":newData.topic,
                  "threshold":newData.threshold,
                  "rally":newData.rally,
                  "team":newData.team,
                  "carId":newData.carId
                })
            }
            axios(getStocksData)
                .then(response => {
        
                    window.location.reload()
        
                })
                .catch(function (e) {
        
                    console.log(e.message)
                    if (e.message === 'Network Error') {
                        alert("No Internet Found. Please check your internet connection")
                    }
                    else {
                        alert("Sorry, something went wrong. Please try again after sometime. If the issue still persists contact support.")
                    }
        
                });
        
        
        
              
              resolve();
            }, 1000)
          }),
        
          
      }}
      options={{
        actionsColumnIndex: -1,
        pageSize: 10,
        exportAllData: true,
        pageSizeOptions: [5, 10, 20, 50, 100, 200],
        exportFileName: "CarDetails",
        exportButton: true



      }}
    />
  )
}
