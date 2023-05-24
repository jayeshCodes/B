import React, { useState, useEffect, useContext } from "react";
import { api } from "../../services/Axios"
import { REACT_APP_API_URL } from "@env"
import * as SecureStore from 'expo-secure-store'
import SplashScreen from "../screens/SplashScreen";
import { axiosContext } from "../../context/AxiosContext";
import { contextData } from "../../context/DataContext";
import moment from "moment";

// HOC that checks for the presence of the grant code and id token
// and redirects the user to the sign-in page if either is missing
const WithAuth = (Component) => {
  const NestedComponent = () => {

    const { isLoggedIn, isLoggedInCallback } = useContext(axiosContext);
    const { groupCallback, profileCallback, subBrokersCallback, reminderCountCallback, tasksDataCallback, brokerSourcesCallback, projectsCallback } = useContext(contextData);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const func = async () => {
        setIsLoading(true);
        const token = await SecureStore.getItemAsync('idToken');
        if (token) {
          try {
            const response = await api.get(`${process.env.REACT_APP_API_URL}/check_token`);
            if (response.data.message === 'success') {
              isLoggedInCallback(true);
            }
          } catch (error) {
            // console.log(error);
            await SecureStore.deleteItemAsync('idToken');
            isLoggedInCallback(false);
          }
        } else {
          await SecureStore.deleteItemAsync('idToken');
          isLoggedInCallback(false);
        }
        setIsLoading(false);
        return null;
      };
      func();
    }, []);

    useEffect(() => {
      const setInitialData = async () => {
        try {
          const response = await api.get(`${process.env.REACT_APP_API_URL}/get_profile`)
          if (response.data) {
            // console.log(response.data)
            profileCallback(response.data)
            groupCallback(response.data.group)
            if (response.data.group === "admin") {
              const res = await api.get(`${process.env.REACT_APP_API_URL}/get?table=Subbroker`)
              // console.log(res.data)
              subBrokersCallback(res.data)
              // console.log("subBrokers just set")
            }
            if (response.data.group !== "individual") {
              const res = await api.get(`${process.env.REACT_APP_API_URL}/get?table=brokerSource`);
              if (res.data) {
                brokerSourcesCallback(res.data);
              }
            }
          }
          const resp = await api.get(`${process.env.REACT_APP_API_URL}/get_pending_leads`)
          if (resp.data) {
            tasksDataCallback(resp.data);
            reminderCountCallback(resp.data.filter((lead) => {
              return lead.status !== 'Incoming' ? moment(lead.scheduled_date).format('DD/MM/YYYY') === moment(new Date()).format('DD/MM/YYYY') : moment(lead.lead_date).format('DD/MM/YYYY') === moment(new Date()).format('DD/MM/YYYY');
            }).length)
          }
          const respo = await api.get(`${process.env.REACT_APP_API_URL}/get_properties`);
          if (respo.data) {
            projectsCallback(respo.data.properties);
          }
        } catch (err) {
          // console.log(err);
          profileCallback({})
          groupCallback("")
          subBrokersCallback([])
          tasksDataCallback([])
          reminderCountCallback(0)
          brokerSourcesCallback([])
          projectsCallback([])
        }
      };
      if (isLoggedIn) {
        setInitialData();
      }
    }, [isLoggedIn])


    if (isLoading) {
      return <SplashScreen />;
    } else {
      return <Component />;
    }
  };

  return NestedComponent;
};

export default WithAuth;
