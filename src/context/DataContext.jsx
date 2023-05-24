import { createContext, useState, useEffect } from "react";
import moment from "moment";

export const contextData = createContext();

const initialFilterObject = {
  sortOrder: "Date (Latest First)",
  dateStart: "",
  dateEnd: "",
  names: [],
  mobiles: [],
  source: [],
  brokerSources: [],
  propertyNames: [],
  propertyAreas: [],
  propertyTypes: [],
  dealTypes: [],
  statuses: [],
  calenderDate: "",
  assignedTo: []
}

const DataContext = (props) => {

  const [group, setGroup] = useState("");
  const [profile, setProfile] = useState({});
  const [subBrokers, setSubBrokers] = useState([]);
  const [subBrokersActive, setSubBrokersActive] = useState([]);
  const [leadsTableData, setLeadsTableData] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [tasksData, setTasksData] = useState([]);
  const [filterObject, setFilterObject] = useState(initialFilterObject);
  const [dashboardFilters, setDashboardFilters] = useState({
    dateStart: "",
    dateEnd: "",
    employees: []
  });
  const [reminderCount, setReminderCount] = useState(0);
  const [brokerSources, setBrokerSources] = useState([]);
  const [projects, setProjects] = useState([]);
  
  const sortLeads = (value) => {
    if (value.length > 0) {
      if (filterObject.sortOrder === "Date (Latest First)") {
        value.sort((a, b) => {
          dateComparison = new Date(b.lead_date) - new Date(a.lead_date);
          if (dateComparison === 0) {
            return b.LID - a.LID;
          }
          return dateComparison;
        });
      } else if (filterObject.sortOrder === "Date (Oldest First)") {
        value.sort((a, b) => {
          dateComparison = new Date(a.lead_date) - new Date(b.lead_date);
          if (dateComparison === 0) {
            return b.LID - a.LID;
          }
          return dateComparison;
        });
      } else if (filterObject.sortOrder === "Reminder Date (Latest First)") {
        value.sort((a, b) => {
          dateComparison = new Date(b.scheduled_date) - new Date(a.scheduled_date);
          if (dateComparison === 0) {
            return b.LID - a.LID;
          }
          return dateComparison;
        });
      } else if (filterObject.sortOrder === "Reminder Date (Oldest First)") {
        value.sort((a, b) => {
          dateComparison = new Date(a.scheduled_date) - new Date(b.scheduled_date);
          if (dateComparison === 0) {
            return b.LID - a.LID;
          }
          return dateComparison;
        });
      }
    }
    return value;
  }

  const groupCallback = (value) => {
    if (value) {
      setGroup(value);
      // console.log(value)
    }
  }

  const profileCallback = (value) => {
    setProfile(value);
  }

  const subBrokersCallback = (value) => {
    setSubBrokers(value);
    setSubBrokersActive(value.filter((element) => element.active === "Active"));
  }

  const leadsTableDataCallback = (value) => {
    setLeadsTableData(sortLeads(value));
  }

  const filteredLeadsCallback = (value) => {
    setFilteredLeads(sortLeads(value));
  }

  const tasksDataCallback = (value) => {
    setTasksData(value);
  }

  const filterObjectCallback = (value, field, selectAll = false) => {
    if (['sortOrder', 'dateStart', 'dateEnd', 'calenderDate'].includes(field)) {
      setFilterObject((prevState) => ({ ...prevState, [field]: value }));
    } else {
      if (selectAll) {
        setFilterObject((prevState) => ({ ...prevState, [field]: value }));
      } else {
        if (filterObject[field].includes(value)) {
          setFilterObject((prevState) => ({ ...prevState, [field]: prevState[field].filter((element) => element !== value) }));
        } else {
          setFilterObject((prevState) => ({ ...prevState, [field]: [...prevState[field], value] }));
        }
      }
    }
  }

  const resetFilterObjectCallback = () => {
    setFilterObject(initialFilterObject);
  }

  const dashboardFiltersCallback = (value) => {
    setDashboardFilters(value);
  }

  const reminderCountCallback = (value) => {
    setReminderCount(value);
  }

  const brokerSourcesCallback = (value) => {
    setBrokerSources(value);
  }

  const projectsCallback = (value) => {
    setProjects(value);
  }

  useEffect(() => {
    setReminderCount(tasksData.filter((lead) => {
      return lead.status !== 'Incoming' ? moment(lead.scheduled_date).format('DD/MM/YYYY') === moment(new Date()).format('DD/MM/YYYY') : moment(lead.lead_date).format('DD/MM/YYYY') === moment(new Date()).format('DD/MM/YYYY');
    }).length)
  }, [tasksData])

  return (
    <contextData.Provider
      value={{ group, groupCallback, profile, profileCallback, subBrokers, subBrokersCallback, subBrokersActive, leadsTableData, leadsTableDataCallback, filteredLeads, filteredLeadsCallback, tasksData, tasksDataCallback, filterObject, filterObjectCallback, resetFilterObjectCallback, dashboardFilters, dashboardFiltersCallback, reminderCount, reminderCountCallback, brokerSources, brokerSourcesCallback, projects, projectsCallback }}
    >
      {props.children}
    </contextData.Provider>
  )
}
export default DataContext;