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
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix leaflet's default icon path so markers show up
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

import { 
  Recycle, 
  Users, 
  Award, 
  MapPin, 
  Trash2, 
  Lightbulb,
  Package,
  FileText,
  CheckCircle,
  AlertCircle,
  Info,
  Circle
} from "lucide-react";

/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */
Amplify.configure(outputs);
const client = generateClient({ authMode: "userPool" });

const recyclingCenters = [
    { id: 1, name: "Kampala Central Recycling Hub", lat: 0.3476, lng: 32.5825, type: "active", capacity: 85 },
    { id: 2, name: "Entebbe Collection Point", lat: 0.0640, lng: 32.4598, type: "collection", capacity: 60 },
    { id: 3, name: "Jinja Eco Center", lat: 0.4313, lng: 33.2030, type: "active", capacity: 92 },
    { id: 4, name: "Mbarara Waste Hub", lat: -0.6076, lng: 30.6589, type: "full", capacity: 100 },
    { id: 5, name: "Gulu Green Point", lat: 2.7856, lng: 32.2988, type: "collection", capacity: 45 },
    { id: 6, name: "Fort Portal Recycling", lat: 0.6612, lng: 30.2731, type: "active", capacity: 70 }
];

const materialGuides = [
  {
    icon: Circle,
    title: "Plastics",
    color: "#3B82F6",
    backgroundColor: "#EBF8FF",
    borderColor: "#93C5FD",
    guidelines: [
      "Rinse containers thoroughly to remove food residue",
      "Remove all labels and caps when possible",
      "Sort by recycling number (1-7) found on bottom",
      "Crush bottles to save space"
    ],
    accepted: ["Water bottles", "Food containers", "Detergent bottles", "Yogurt cups"],
    rejected: ["Plastic bags", "Styrofoam", "Broken plastic items", "Medical containers"]
  },
  {
    icon: Lightbulb,
    title: "Glass",
    color: "#10B981",
    backgroundColor: "#F0FDF4",
    borderColor: "#86EFAC",
    guidelines: [
      "Separate by color: clear, brown, and green",
      "Remove metal lids and plastic labels",
      "Rinse to remove food particles",
      "Handle carefully to avoid breakage"
    ],
    accepted: ["Bottles", "Jars", "Food containers", "Beverage bottles"],
    rejected: ["Window glass", "Mirrors", "Light bulbs", "Ceramics"]
  },
  {
    icon: Package,
    title: "Metals",
    color: "#F59E0B",
    backgroundColor: "#FFFBEB",
    borderColor: "#FCD34D",
    guidelines: [
      "Rinse all cans and containers",
      "Remove paper labels when possible",
      "Flatten cans to save storage space",
      "Separate aluminum from steel"
    ],
    accepted: ["Aluminum cans", "Steel cans", "Food tins", "Aerosol cans (empty)"],
    rejected: ["Paint cans", "Chemical containers", "Batteries", "Electronics"]
  },
  {
    icon: FileText,
    title: "Paper & Cardboard",
    color: "#8B5CF6",
    backgroundColor: "#F5F3FF",
    borderColor: "#C4B5FD",
    guidelines: [
      "Keep materials clean and dry",
      "Remove all food residue and grease",
      "Flatten cardboard boxes",
      "Remove plastic tape and staples"
    ],
    accepted: ["Newspapers", "Magazines", "Cardboard boxes", "Office paper"],
    rejected: ["Wax-coated paper", "Tissues", "Paper towels", "Pizza boxes (greasy)"]
  }
];

const MaterialCard = ({ material }) => {
  const IconComponent = material.icon;
  
  return (
    <View
      backgroundColor={material.backgroundColor}
      border={`2px solid ${material.borderColor}`}
      borderRadius="16px"
      padding="1.5rem"
      marginBottom="1.5rem"
      boxShadow="0 4px 12px rgba(0,0,0,0.08)"
      transition="all 0.3s ease"
      style={{
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
        }
      }}
    >
      {/* Header */}
      <Flex alignItems="center" marginBottom="1rem">
        <View
          backgroundColor={material.color}
          borderRadius="12px"
          padding="0.75rem"
          marginRight="1rem"
        >
          <IconComponent size={24} color="white" />
        </View>
        <Heading level={4} color={material.color} margin="0">
          {material.title}
        </Heading>
      </Flex>

      {/* Guidelines */}
      <View marginBottom="1.5rem">
        <Heading level={6} marginBottom="0.5rem" color="#374151">
          Preparation Guidelines:
        </Heading>
        {material.guidelines.map((guideline, index) => (
          <Flex key={index} alignItems="flex-start" marginBottom="0.5rem">
            <CheckCircle size={16} color={material.color} style={{ marginRight: '0.5rem', marginTop: '2px', flexShrink: 0 }} />
            <View fontSize="0.9rem" color="#6B7280">
              {guideline}
            </View>
          </Flex>
        ))}
      </View>

      {/* Accepted vs Rejected */}
      <Grid templateColumns="1fr 1fr" gap="1rem">
        {/* Accepted */}
        <View>
          <Flex alignItems="center" marginBottom="0.5rem">
            <CheckCircle size={16} color="#10B981" style={{ marginRight: '0.5rem' }} />
            <View fontSize="0.85rem" fontWeight="600" color="#059669">
              ACCEPTED
            </View>
          </Flex>
          {material.accepted.map((item, index) => (
            <View key={index} fontSize="0.8rem" color="#6B7280" marginBottom="0.25rem">
              • {item}
            </View>
          ))}
        </View>

        {/* Rejected */}
        <View>
          <Flex alignItems="center" marginBottom="0.5rem">
            <AlertCircle size={16} color="#EF4444" style={{ marginRight: '0.5rem' }} />
            <View fontSize="0.85rem" fontWeight="600" color="#DC2626">
              NOT ACCEPTED
            </View>
          </Flex>
          {material.rejected.map((item, index) => (
            <View key={index} fontSize="0.8rem" color="#6B7280" marginBottom="0.25rem">
              • {item}
            </View>
          ))}
        </View>
      </Grid>
    </View>
  );
};

export default function App() {
  const [userprofiles, setUserProfiles] = useState([]);
  const { signOut, user } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  async function fetchUserProfile() {
    try {
      const { data: profiles } = await client.models.UserProfile.list();
      setUserProfiles(profiles);
    } catch (error) {
      console.error("Failed to fetch user profiles:", error);
    }
  }

  const currentUser = userprofiles.find(
    (u) => u.email === user?.attributes?.email
  );

  return (
    <Flex direction="row" height="100vh" overflow="hidden">
      {/* Enhanced Sidebar */}
      <View
        width="20%"
        padding="2rem"
        backgroundColor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        color="white"
        borderRight="none"
        boxShadow="4px 0 20px rgba(0,0,0,0.1)"
      >
        <Flex alignItems="center" marginBottom="2rem">
          <Recycle size={32} style={{ marginRight: '0.75rem' }} />
          <Heading level={3} color="green" margin="0">
            Recycle Bulungi Dashboard
          </Heading>
        </Flex>
        
        <Divider margin="1rem 0" backgroundColor="rgba(255,255,255,0.2)" />
        
        <View
          backgroundColor="rgba(255,255,255,0.1)"
          borderRadius="12px"
          padding="1rem"
          marginBottom="2rem"
        >
          <Heading level={5} color="green" margin="0 0 0.5rem 0">
            Welcome back,
          </Heading>
          <View fontSize="1.1rem" fontWeight="600" color="green">
            {user?.username || 'User'}
          </View>
        </View>

        <Button 
          onClick={signOut} 
          variation="primary"
          backgroundColor="rgba(255,255,255,0.2)"
          color="white"
          border="1px solid rgba(255,255,255,0.3)"
          borderRadius="8px"
          width="100%"
          style={{
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.3)'
            }
          }}
        >
          Sign Out
        </Button>
      </View>

      {/* Enhanced Main Dashboard */}
      <View width="80%" padding="3rem" overflow="auto" backgroundColor="#F8FAFC">
        <Flex alignItems="center" marginBottom="2rem">
          <Heading level={2} margin="0" color="#1F2937">
            Recycle Bulungi
          </Heading>
        </Flex>

        {/* Enhanced Stats Grid */}
        <Grid templateColumns="repeat(3, 1fr)" gap="2rem" marginBottom="3rem">
          {/* Total Users */}
          <View
            backgroundColor="white"
            padding="2rem"
            borderRadius="16px"
            boxShadow="0 4px 16px rgba(0,0,0,0.08)"
            border="1px solid #E5E7EB"
          >
            <Flex alignItems="center" marginBottom="1rem">
              <View
                backgroundColor="#3B82F6"
                borderRadius="12px"
                padding="0.75rem"
                marginRight="1rem"
              >
                <Users size={24} color="white" />
              </View>
              <Heading level={4} margin="0" color="#374151">
                Total Users
              </Heading>
            </Flex>
            <View fontSize="2.5rem" fontWeight="700" color="#1F2937">
              {userprofiles.length}
            </View>
            <View fontSize="0.9rem" color="#6B7280" marginTop="0.5rem">
              Active community members
            </View>
          </View>

          {/* Rewards */}
          <View
            backgroundColor="white"
            padding="2rem"
            borderRadius="16px"
            boxShadow="0 4px 16px rgba(0,0,0,0.08)"
            border="1px solid #E5E7EB"
          >
            <Flex alignItems="center" marginBottom="1rem">
              <View
                backgroundColor="#10B981"
                borderRadius="12px"
                padding="0.75rem"
                marginRight="1rem"
              >
                <Award size={24} color="white" />
              </View>
              <Heading level={4} margin="0" color="#374151">
                Your Points
              </Heading>
            </Flex>
            <View fontSize="2.5rem" fontWeight="700" color="#1F2937">
              {currentUser?.rewards || 0}
            </View>
            <View fontSize="0.9rem" color="#6B7280" marginTop="0.5rem">
              Recycling reward points
            </View>
          </View>

          {/* Recent User */}
          <View
            backgroundColor="white"
            padding="2rem"
            borderRadius="16px"
            boxShadow="0 4px 16px rgba(0,0,0,0.08)"
            border="1px solid #E5E7EB"
          >
            <Flex alignItems="center" marginBottom="1rem">
              <View
                backgroundColor="#8B5CF6"
                borderRadius="12px"
                padding="0.75rem"
                marginRight="1rem"
              >
                <MapPin size={24} color="white" />
              </View>
              <Heading level={4} margin="0" color="#374151">
                Latest Member
              </Heading>
            </Flex>
            <View fontSize="1.1rem" fontWeight="600" color="#1F2937">
              {userprofiles[0]?.email?.split('@')[0] || 'No users yet'}
            </View>
            <View fontSize="0.9rem" color="#6B7280" marginTop="0.5rem">
              Recently joined
            </View>
          </View>
        </Grid>

        {/* Enhanced Map Section */}
        <View
          backgroundColor="white"
          padding="2rem"
          borderRadius="16px"
          boxShadow="0 4px 16px rgba(0,0,0,0.08)"
          border="1px solid #E5E7EB"
          marginBottom="3rem"
        >
          <Flex alignItems="center" marginBottom="1.5rem">
            <MapPin size={28} color="#3B82F6" style={{ marginRight: '0.75rem' }} />
            <Heading level={3} margin="0" color="#1F2937">
              Nearby Recycling Centers
            </Heading>
          </Flex>
          <MapContainer
            center={[0.3476, 32.5825]}
            zoom={7}
            style={{ 
              height: "350px", 
              width: "100%", 
              borderRadius: "12px",
              border: "2px solid #E5E7EB"
            }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {recyclingCenters.map((center) => (
              <Marker key={center.id} position={[center.lat, center.lng]}>
                <Popup>
                  <div>
                    <strong>{center.name}</strong><br/>
                    Status: {center.type}<br/>
                    Capacity: {center.capacity}%
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </View>

        {/* Material Separation Guide */}
        <View
          backgroundColor="white"
          padding="2rem"
          borderRadius="16px"
          boxShadow="0 4px 16px rgba(0,0,0,0.08)"
          border="1px solid #E5E7EB"
        >
          <Flex alignItems="center" marginBottom="1rem">
            <Trash2 size={28} color="#059669" style={{ marginRight: '0.75rem' }} />
            <Heading level={3} margin="0" color="#1F2937">
              Complete Material Separation Guide
            </Heading>
          </Flex>
          <Flex alignItems="center" backgroundColor="#EBF8FF" padding="1rem" borderRadius="8px" marginBottom="2rem">
            <Info size={20} color="#3B82F6" style={{ marginRight: '0.75rem' }} />
            <View fontSize="0.95rem" color="#1E40AF">
              Proper separation ensures maximum recycling efficiency and environmental impact.
            </View>
          </Flex>
          <Grid templateColumns="repeat(2, 1fr)" gap="2rem">
            {materialGuides.map((material, index) => (
              <MaterialCard key={index} material={material} />
            ))}
          </Grid>

          {/* Additional Tips */}
          <View
            backgroundColor="#FEF3C7"
            border="2px solid #FCD34D"
            borderRadius="12px"
            padding="1.5rem"
            marginTop="2rem"
          >
            <Flex alignItems="center" marginBottom="1rem">
              <Lightbulb size={24} color="#D97706" style={{ marginRight: '0.75rem' }} />
              <Heading level={4} margin="0" color="#92400E">
                Pro Tips for Better Recycling
              </Heading>
            </Flex>
            <Grid templateColumns="repeat(2, 1fr)" gap="1rem">
              <View fontSize="0.9rem" color="#78350F">
                • Clean containers save processing time
              </View>
              <View fontSize="0.9rem" color="#78350F">
                • When in doubt, check local guidelines
              </View>
              <View fontSize="0.9rem" color="#78350F">
                • Small actions create big environmental impact
              </View>
              <View fontSize="0.9rem" color="#78350F">
                • Reduce and reuse before recycling
              </View>
            </Grid>
          </View>
        </View>
      </View>
    </Flex>
  );
}