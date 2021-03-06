import React, { useState, useEffect } from 'react';
import { forwardRef } from 'react';
import Avatar from 'react-avatar';
import Grid from '@material-ui/core/Grid'
import MaterialTable from "material-table";
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import Alert from '@material-ui/lab/Alert';
import firebase from './firebase'
import logo from './logo.svg'

function App() {
  const db = firebase.firestore()
  const [data, setData] = useState([])
  const [iserror, setIserror] = useState(false)
  const [errorMessages, setErrorMessages] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)


  const columns = [
    {
      title: "id", 
      field: "id", 
      hidden: true
    },
    {
      title: "Position", 
      field: "position", 
      hidden: false
    },
    {
      title: "Avatar", 
      render: rowData => {
        return rowData.avatar ? <img className="avatar"  src={rowData.avatar} /> : <Avatar maxInitials={1} size={40} round={true} name={rowData === undefined ? " " : rowData.name} />
      }  
      },
    {
      title: "Name",
      field: "name"
    },
    {
      title: "Torneios",
      field: "tournaments"
    },
    {
      title: "Premiado",
      field: "premium"
    },
    {
      title: "Pontos",
      field: "points"
    }
  ]
  const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  }
  
  useEffect(() => {
		const fetchData = async () => {
			const db = firebase.firestore();
			const data = await db.collection("users").get();
      let users = data.docs.map(doc => ({ ...doc.data(), id: doc.id }))
      setData(users)
		}
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
	},[])

  const handleRowUpdate = (newData, oldData, resolve) => {
    let errorList = []
    if(newData.name === ""){
      errorList.push("Please enter the name")
    }
   
    if(errorList.length < 1){
      db.collection("users").doc(newData.id).set({...newData, newData})
      resolve()
      const dataUpdate = [...data];
      const index = oldData.tableData.id;
      dataUpdate[index] = newData;
      setData([...dataUpdate]);
      resolve()
      setIserror(false)
      setErrorMessages([])
     
    }else{
      setErrorMessages(errorList)
      setIserror(true)
      resolve()
    }
  }

  const handleRowAdd = (newData, resolve) => {
    let errorList = []
    if(newData.name === undefined){
      errorList.push("Please enter the name")
    }
    if(errorList.length < 1){
      db.collection("users").add(newData);
      let dataToAdd = [...data];
      dataToAdd.push(newData);
      setData(dataToAdd);
      resolve()
      setErrorMessages([])
      setIserror(false)
    }else{
      setErrorMessages(errorList)
      setIserror(true)
      resolve()
    }
  }

  const handleRowDelete = (oldData, resolve) => {
    db.collection('users').doc(oldData.id).delete()
    const dataDelete = [...data];
    const index = oldData.tableData.id;
    dataDelete.splice(index, 1);
    setData([...dataDelete]);
    resolve()
  }

  return (
    <div className="App">
      <Grid container spacing={1}>
        <Grid item xs={1}></Grid>
            <Grid item xs={10}>
              <div className="header">
                <img className="logo" src={logo} alt="logo"/>
                <h2>POKER STATS</h2>
                <a>admin</a>
              </div>
            </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
     <main>
     <Grid container spacing={1}>
          <Grid item xs={1}></Grid>
          <Grid item xs={10}>
          <div>
            {iserror && 
              <Alert severity="error">
                  {errorMessages.map((msg, i) => {
                      return <div key={i}>{msg}</div>
                  })}
              </Alert>
            }       
          </div>
            <MaterialTable
              title="Drama no Penico"
              columns={columns}
              data={data}
              icons={tableIcons}
              editable={{
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve) => {
                      handleRowUpdate(newData, oldData, resolve);
                  }),
                onRowAdd: (newData) =>
                  new Promise((resolve) => {
                    handleRowAdd(newData, resolve)
                  }),
                onRowDelete: (oldData) =>
                  new Promise((resolve) => {
                    handleRowDelete(oldData, resolve)
                  }),
              }}
            />
          </Grid>
          <Grid item xs={1}></Grid>
        </Grid>
    
     </main>
     
    </div>
  )
}

export default App;