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
/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */


Amplify.configure(outputs);
const client = generateClient({
  authMode: "userPool",
});

export default function App() {
  const [userprofiles, setUserProfiles] = useState([]);
  const { signOut } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  async function fetchUserProfile() {
    const { data: profiles } = await client.models.UserProfile.list();
    setUserProfiles(profiles);
  }

  return (
    <div
      style={{
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        padding: "1rem",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#1e293b",
              margin: 0,
            }}
          >
            Recycle Bulungi
          </h1>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.5rem",
              backgroundColor: "white",
              border: "2px solid #e2e8f0",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#374151",
              transition: "all 0.2s",
            }}
            onClick={signOut}
          >
            Sign Out
          </button>
        </div>

        {/* Profile Section */}
        <div
          style={{
            backgroundColor: "white",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e2e8f0",
            marginBottom: "2rem",
          }}
        >
          <h3
            style={{
              color: "#1e293b",
              marginBottom: "1rem",
            }}
          >
            Profile Information
          </h3>
          {userprofiles.length > 0 ? (
            userprofiles.map((userprofile) => (
              <div
                key={userprofile.id || userprofile.email}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1rem",
                  backgroundColor: "#f8fafc",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "#3B82F6",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                  }}
                >
                  {userprofile.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: "bold",
                      color: "#1e293b",
                    }}
                  >
                    {userprofile.email}
                  </div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "#64748b",
                    }}
                  >
                    Active Recycler
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ color: "#64748b" }}>No profiles found.</div>
          )}
        </div>
      </div>
    </div>
  );
}