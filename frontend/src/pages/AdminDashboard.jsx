import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  Admin,
  Resource,
  List,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  Edit,
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  DateInput,
  Button,
  TopToolbar,
  ExportButton,
  FilterButton,
  CreateButton,
  FilterForm,
  SearchInput,
  SelectInput,
  ArrayField,
  SingleFieldList,
  ChipField,
} from 'react-admin';
import { Train, Bus, Users, CreditCard, Settings, MapPin, Clock, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { busTypes, highwayRoutes, intercityRoutes, busOperators } from '../data/busData';
import { trainTypes, trainRoutes } from '../data/trainData';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Dummy data for analytics
const dummyData = {
  users: Array.from({ length: 50 }, (_, i) => ({
    id: `user-${i + 1}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    phone: `+94 ${Math.floor(Math.random() * 900000000 + 100000000)}`,
    createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    bookings: Math.floor(Math.random() * 10),
    totalSpent: Math.floor(Math.random() * 50000)
  })),
  transactions: Array.from({ length: 100 }, (_, i) => ({
    id: `trans-${i + 1}`,
    type: Math.random() > 0.5 ? 'BUS' : 'TRAIN',
    status: ['PENDING', 'COMPLETED', 'FAILED'][Math.floor(Math.random() * 3)],
    amount: Math.floor(Math.random() * 5000) + 500,
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    userId: `user-${Math.floor(Math.random() * 50) + 1}`
  })),
  bookings: Array.from({ length: 200 }, (_, i) => ({
    id: `booking-${i + 1}`,
    type: Math.random() > 0.5 ? 'BUS' : 'TRAIN',
    status: ['CONFIRMED', 'CANCELLED', 'COMPLETED'][Math.floor(Math.random() * 3)],
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    userId: `user-${Math.floor(Math.random() * 50) + 1}`,
    amount: Math.floor(Math.random() * 5000) + 500
  }))
};

// Initialize data in localStorage if not exists
const initializeData = () => {
  // Initialize existing data
  if (!localStorage.getItem('busRoutes')) {
    const busRoutes = [
      ...highwayRoutes.map(route => ({
        ...route,
        id: `highway-${route.from}-${route.to}`,
        type: 'HIGHWAY',
        price: Math.round(route.distance * 3.5 * busTypes.HIGHWAY.priceMultiplier),
        amenities: busTypes.HIGHWAY.amenities
      })),
      ...intercityRoutes.map(route => ({
        ...route,
        id: `intercity-${route.from}-${route.to}`,
        type: 'INTERCITY',
        price: Math.round(route.distance * 3.5 * busTypes.INTERCITY.priceMultiplier),
        amenities: busTypes.INTERCITY.amenities
      }))
    ];
    localStorage.setItem('busRoutes', JSON.stringify(busRoutes));
  }

  if (!localStorage.getItem('trainRoutes')) {
    const trainRoutesData = trainRoutes.map(route => ({
      ...route,
      id: `train-${route.from}-${route.to}`,
      price: Math.round(route.distance * 10),
      amenities: trainTypes.EXPRESS.amenities
    }));
    localStorage.setItem('trainRoutes', JSON.stringify(trainRoutesData));
  }

  if (!localStorage.getItem('busOperators')) {
    localStorage.setItem('busOperators', JSON.stringify(busOperators));
  }

  // Initialize dummy data
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(dummyData.users));
  }
  if (!localStorage.getItem('transactions')) {
    localStorage.setItem('transactions', JSON.stringify(dummyData.transactions));
  }
  if (!localStorage.getItem('bookings')) {
    localStorage.setItem('bookings', JSON.stringify(dummyData.bookings));
  }
};

// Call initialization
initializeData();

// Mock data providers
const dataProvider = {
  getList: (resource) => {
    const data = JSON.parse(localStorage.getItem(resource) || '[]');
    return Promise.resolve({
      data,
      total: data.length,
    });
  },
  getOne: (resource, params) => {
    const data = JSON.parse(localStorage.getItem(resource) || '[]');
    const record = data.find(item => item.id === params.id);
    return Promise.resolve({ data: record });
  },
  create: (resource, params) => {
    const data = JSON.parse(localStorage.getItem(resource) || '[]');
    const newRecord = { ...params.data, id: Date.now().toString() };
    data.push(newRecord);
    localStorage.setItem(resource, JSON.stringify(data));
    return Promise.resolve({ data: newRecord });
  },
  update: (resource, params) => {
    const data = JSON.parse(localStorage.getItem(resource) || '[]');
    const index = data.findIndex(item => item.id === params.id);
    data[index] = { ...data[index], ...params.data };
    localStorage.setItem(resource, JSON.stringify(data));
    return Promise.resolve({ data: data[index] });
  },
  delete: (resource, params) => {
    const data = JSON.parse(localStorage.getItem(resource) || '[]');
    const filteredData = data.filter(item => item.id !== params.id);
    localStorage.setItem(resource, JSON.stringify(filteredData));
    return Promise.resolve({ data: params.id });
  },
};

// Custom actions
const ListActions = () => (
  <TopToolbar>
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

// Bus Route Filters
const BusRouteFilters = [
  <SearchInput source="from" alwaysOn />,
  <TextInput source="to" label="To" />,
  <SelectInput source="type" choices={[
    { id: 'HIGHWAY', name: 'Highway' },
    { id: 'INTERCITY', name: 'Intercity' }
  ]} />,
];

// Bus Route Management
const BusRouteList = () => (
  <List actions={<ListActions />} filters={BusRouteFilters}>
    <Datagrid rowClick="edit">
      <TextField source="from" label="From" />
      <TextField source="to" label="To" />
      <TextField source="type" label="Type" />
      <NumberField source="distance" label="Distance (km)" />
      <TextField source="duration" label="Duration" />
      <NumberField source="price" label="Price (LKR)" />
      <ArrayField source="amenities">
        <SingleFieldList>
          <ChipField source="name" />
        </SingleFieldList>
      </ArrayField>
    </Datagrid>
  </List>
);

const BusRouteEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="from" label="From" />
      <TextInput source="to" label="To" />
      <SelectInput source="type" choices={[
        { id: 'HIGHWAY', name: 'Highway' },
        { id: 'INTERCITY', name: 'Intercity' }
      ]} />
      <NumberInput source="distance" label="Distance (km)" />
      <TextInput source="duration" label="Duration" />
      <NumberInput source="price" label="Price (LKR)" />
      <ArrayField source="amenities">
        <SingleFieldList>
          <ChipField source="name" />
        </SingleFieldList>
      </ArrayField>
    </SimpleForm>
  </Edit>
);

const BusRouteCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="from" label="From" />
      <TextInput source="to" label="To" />
      <SelectInput source="type" choices={[
        { id: 'HIGHWAY', name: 'Highway' },
        { id: 'INTERCITY', name: 'Intercity' }
      ]} />
      <NumberInput source="distance" label="Distance (km)" />
      <TextInput source="duration" label="Duration" />
      <NumberInput source="price" label="Price (LKR)" />
      <ArrayField source="amenities">
        <SingleFieldList>
          <ChipField source="name" />
        </SingleFieldList>
      </ArrayField>
    </SimpleForm>
  </Create>
);

// Train Route Filters
const TrainRouteFilters = [
  <SearchInput source="from" alwaysOn />,
  <TextInput source="to" label="To" />,
];

// Train Route Management
const TrainRouteList = () => (
  <List actions={<ListActions />} filters={TrainRouteFilters}>
    <Datagrid rowClick="edit">
      <TextField source="from" label="From" />
      <TextField source="to" label="To" />
      <NumberField source="distance" label="Distance (km)" />
      <NumberField source="duration" label="Duration (min)" />
      <NumberField source="price" label="Price (LKR)" />
      <ArrayField source="amenities">
        <SingleFieldList>
          <ChipField source="name" />
        </SingleFieldList>
      </ArrayField>
    </Datagrid>
  </List>
);

const TrainRouteEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="from" label="From" />
      <TextInput source="to" label="To" />
      <NumberInput source="distance" label="Distance (km)" />
      <NumberInput source="duration" label="Duration (min)" />
      <NumberInput source="price" label="Price (LKR)" />
      <ArrayField source="amenities">
        <SingleFieldList>
          <ChipField source="name" />
        </SingleFieldList>
      </ArrayField>
    </SimpleForm>
  </Edit>
);

const TrainRouteCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="from" label="From" />
      <TextInput source="to" label="To" />
      <NumberInput source="distance" label="Distance (km)" />
      <NumberInput source="duration" label="Duration (min)" />
      <NumberInput source="price" label="Price (LKR)" />
      <ArrayField source="amenities">
        <SingleFieldList>
          <ChipField source="name" />
        </SingleFieldList>
      </ArrayField>
    </SimpleForm>
  </Create>
);

// Bus Operator Management
const BusOperatorList = () => (
  <List actions={<ListActions />}>
    <Datagrid rowClick="edit">
      <TextField source="name" label="Operator Name" />
      <TextField source="contact" label="Contact" />
      <TextField source="website" label="Website" />
      <NumberField source="rating" label="Rating" />
      <ArrayField source="fleet">
        <SingleFieldList>
          <ChipField source="name" />
        </SingleFieldList>
      </ArrayField>
    </Datagrid>
  </List>
);

const BusOperatorEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" label="Operator Name" />
      <TextInput source="contact" label="Contact" />
      <TextInput source="website" label="Website" />
      <NumberInput source="rating" label="Rating" />
      <ArrayField source="fleet">
        <SingleFieldList>
          <ChipField source="name" />
        </SingleFieldList>
      </ArrayField>
    </SimpleForm>
  </Edit>
);

const BusOperatorCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" label="Operator Name" />
      <TextInput source="contact" label="Contact" />
      <TextInput source="website" label="Website" />
      <NumberInput source="rating" label="Rating" />
      <ArrayField source="fleet">
        <SingleFieldList>
          <ChipField source="name" />
        </SingleFieldList>
      </ArrayField>
    </SimpleForm>
  </Create>
);

// Transaction Filters
const TransactionFilters = [
  <SearchInput source="id" alwaysOn />,
  <SelectInput source="status" choices={[
    { id: 'PENDING', name: 'Pending' },
    { id: 'COMPLETED', name: 'Completed' },
    { id: 'FAILED', name: 'Failed' }
  ]} />,
  <DateInput source="date" label="Transaction Date" />,
];

// Transaction Management
const TransactionList = () => (
  <List actions={<ListActions />} filters={TransactionFilters}>
    <Datagrid>
      <TextField source="id" label="Transaction ID" />
      <TextField source="type" label="Type" />
      <TextField source="status" label="Status" />
      <NumberField source="amount" label="Amount" />
      <DateField source="date" label="Date" />
    </Datagrid>
  </List>
);

// User Filters
const UserFilters = [
  <SearchInput source="name" alwaysOn />,
  <TextInput source="email" label="Email" />,
  <TextInput source="phone" label="Phone" />,
];

// User Management
const UserList = () => (
  <List actions={<ListActions />} filters={UserFilters}>
    <Datagrid>
      <TextField source="name" label="Name" />
      <TextField source="email" label="Email" />
      <TextField source="phone" label="Phone" />
      <DateField source="createdAt" label="Created At" />
    </Datagrid>
  </List>
);

// Analytics Dashboard Component
const AnalyticsDashboard = () => {
  const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  const users = JSON.parse(localStorage.getItem('users') || '[]');

  // Revenue over time data
  const revenueData = {
    labels: Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }),
    datasets: [
      {
        label: 'Revenue (LKR)',
        data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100000) + 50000),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  // Booking distribution data
  const bookingDistributionData = {
    labels: ['Bus', 'Train'],
    datasets: [
      {
        data: [
          bookings.filter(b => b.type === 'BUS').length,
          bookings.filter(b => b.type === 'TRAIN').length
        ],
        backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)']
      }
    ]
  };

  // Transaction status data
  const transactionStatusData = {
    labels: ['Completed', 'Pending', 'Failed'],
    datasets: [
      {
        label: 'Transactions',
        data: [
          transactions.filter(t => t.status === 'COMPLETED').length,
          transactions.filter(t => t.status === 'PENDING').length,
          transactions.filter(t => t.status === 'FAILED').length
        ],
        backgroundColor: ['rgb(75, 192, 192)', 'rgb(255, 205, 86)', 'rgb(255, 99, 132)']
      }
    ]
  };

  // Key metrics
  const totalRevenue = transactions
    .filter(t => t.status === 'COMPLETED')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalBookings = bookings.length;
  const totalUsers = users.length;
  const averageBookingValue = totalRevenue / totalBookings;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Analytics Dashboard
      </Typography>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h5">
                LKR {totalRevenue.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Bookings
              </Typography>
              <Typography variant="h5">
                {totalBookings}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h5">
                {totalUsers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Booking Value
              </Typography>
              <Typography variant="h5">
                LKR {Math.round(averageBookingValue).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Revenue Over Time
              </Typography>
              <Line data={revenueData} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Booking Distribution
              </Typography>
              <Doughnut data={bookingDistributionData} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Transaction Status
              </Typography>
              <Bar data={transactionStatusData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

const AdminDashboard = () => {
  const { isAdmin } = useAdminAuth();
  const navigate = useNavigate();

  if (!isAdmin) {
    navigate('/admin/login');
    return null;
  }

  return (
    <Admin dataProvider={dataProvider}>
      <Resource
        name="analytics"
        list={AnalyticsDashboard}
        icon={TrendingUp}
      />
      <Resource
        name="busRoutes"
        list={BusRouteList}
        edit={BusRouteEdit}
        create={BusRouteCreate}
        icon={Bus}
      />
      <Resource
        name="trainRoutes"
        list={TrainRouteList}
        edit={TrainRouteEdit}
        create={TrainRouteCreate}
        icon={Train}
      />
      <Resource
        name="busOperators"
        list={BusOperatorList}
        edit={BusOperatorEdit}
        create={BusOperatorCreate}
        icon={Settings}
      />
      <Resource
        name="transactions"
        list={TransactionList}
        icon={CreditCard}
      />
      <Resource
        name="users"
        list={UserList}
        icon={Users}
      />
    </Admin>
  );
};

export default AdminDashboard; 