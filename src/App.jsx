import { useState, useEffect } from "react";
import {
  Button,
  Heading,
  Flex,
  View,
  Grid,
  Divider,
} from "@aws-amplify/ui-react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */
Amplify.configure(outputs);
const client = generateClient({ authMode: "userPool" });

const recyclingCenters = [
  { lat: 40.7128, lng: -74.006, name: "Center A - Manhattan" },
  { lat: 40.7306, lng: -73.9352, name: "Center B - Brooklyn" },
];

export default function App() {
  const [userprofiles, setUserProfiles] = useState([]);
  const { signOut, user } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  async function fetchUserProfile() {
    const { data: profiles } = await client.models.UserProfile.list();
    setUserProfiles(profiles);
  }

  const currentUser = userprofiles.find(
    (u) => u.email === user?.attributes?.email
  );

  return (
    <Flex direction="row" height="100vh" overflow="hidden">
      {/* Sidebar */}
      <View
        width="20%"
        padding="2rem"
        backgroundColor="#f5f5f5"
        borderRight="1px solid #ddd"
      >
        <Heading level={3}>Eco Dashboard</Heading>
        <Divider margin="1rem 0" />
        <Heading level={5}>Hello, {user?.username}</Heading>
        <Button onClick={signOut} variation="link" marginTop="2rem">
          Sign Out
        </Button>
      </View>

      {/* Main Dashboard */}
      <View width="80%" padding="3rem" overflow="auto">
        <Heading level={2}>Sustainability Dashboard</Heading>
        <Divider margin="1rem 0" />

        {/* Grid with Rewards + Profile Info */}
        <Grid templateColumns="repeat(3, 1fr)" gap="2rem" marginTop="2rem">
          {/* Total Users */}
          <Flex
            direction="column"
            padding="1.5rem"
            backgroundColor="#ffffff"
            boxShadow="0 2px 8px rgba(0,0,0,0.05)"
            borderRadius="12px"
          >
            <Heading level={4}>Total Users</Heading>
            <View fontSize="2rem">{userprofiles.length}</View>
          </Flex>

          {/* Rewards */}
          <Flex
            direction="column"
            padding="1.5rem"
            backgroundColor="#ffffff"
            boxShadow="0 2px 8px rgba(0,0,0,0.05)"
            borderRadius="12px"
          >
            <Heading level={4}>Your Recycling Points</Heading>
            <View fontSize="2rem">{currentUser?.rewards || 0} pts</View>
          </Flex>

          {/* Recent User */}
          <Flex
            direction="column"
            padding="1.5rem"
            backgroundColor="#ffffff"
            boxShadow="0 2px 8px rgba(0,0,0,0.05)"
            borderRadius="12px"
          >
            <Heading level={4}>Recent User</Heading>
            <View fontSize="1.3rem">
              {userprofiles[0]?.email || "No users available"}
            </View>
          </Flex>
        </Grid>

        {/* Map */}
        <View marginTop="3rem">
          <Heading level={3}>Nearby Recycling Centers</Heading>
          <MapContainer
            center={[40.7128, -74.006]}
            zoom={12}
            style={{ height: "300px", width: "100%", marginTop: "1rem" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {recyclingCenters.map((center, index) => (
              <Marker key={index} position={[center.lat, center.lng]}>
                <Popup>{center.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </View>

        {/* Material Separation */}
        <View marginTop="3rem">
          <Heading level={3}>Material Separation Guide</Heading>
          <Flex direction="column" gap="1rem" marginTop="1rem">
            <View backgroundColor="#eef" padding="1rem" borderRadius="8px">
              <strong>Plastics:</strong> Rinse and remove labels. Sort by number
              (1–7).
            </View>
            <View backgroundColor="#efe" padding="1rem" borderRadius="8px">
              <strong>Glass:</strong> Separate by color. Avoid ceramics and
              mirrors.
            </View>
            <View backgroundColor="#fee" padding="1rem" borderRadius="8px">
              <strong>Metal:</strong> Rinse cans and flatten if possible.
            </View>
            <View backgroundColor="#eef" padding="1rem" borderRadius="8px">
              <strong>Paper/Cardboard:</strong> Keep dry. Remove food residue.
            </View>
          </Flex>
        </View>
      </View>
    </Flex>
  );
}