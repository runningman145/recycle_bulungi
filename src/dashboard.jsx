import { useState, useEffect, useRef } from "react";
import { MapPin, Award, Recycle, Trash2, Package, Coins, LogOut, User } from "lucide-react";

// Rename exported function to Dashboard for clarity and import consistency
export default function Dashboard() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [userprofiles, setUserProfiles] = useState([
    { id: "1", email: "user@example.com", points: 1250, level: "Gold" }
  ]);
  const [rewards, setRewards] = useState({ points: 1250, level: "Gold", streak: 7 });
  const [materials, setMaterials] = useState([
    { type: "Plastic Bottles", count: 45, points: 90, color: "#3B82F6" },
    { type: "Glass Containers", count: 23, points: 115, color: "#10B981" },
    { type: "Aluminum Cans", count: 67, points: 134, color: "#F59E0B" },
    { type: "Paper/Cardboard", count: 89, points: 178, color: "#8B5CF6" },
    { type: "Electronic Waste", count: 12, points: 240, color: "#EF4444" }
  ]);

  // Sample recycling centers in Uganda
  const recyclingCenters = [
    { id: 1, name: "Kampala Central Recycling Hub", lat: 0.3476, lng: 32.5825, type: "active", capacity: 85 },
    { id: 2, name: "Entebbe Collection Point", lat: 0.0640, lng: 32.4598, type: "collection", capacity: 60 },
    { id: 3, name: "Jinja Eco Center", lat: 0.4313, lng: 33.2030, type: "active", capacity: 92 },
    { id: 4, name: "Mbarara Waste Hub", lat: -0.6076, lng: 30.6589, type: "full", capacity: 100 },
    { id: 5, name: "Gulu Green Point", lat: 2.7856, lng: 32.2988, type: "collection", capacity: 45 },
    { id: 6, name: "Fort Portal Recycling", lat: 0.6612, lng: 30.2731, type: "active", capacity: 70 }
  ];

  const signOut = () => {
    console.log("Sign out clicked");
    alert("Sign out functionality - integrate with your auth system");
  };

  // Initialize OpenStreetMap
  useEffect(() => {
    if (!mapRef.current) return;

    // Load Leaflet CSS and JS
    const loadLeaflet = async () => {
      // Add Leaflet CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Load Leaflet JS
      if (!window.L) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      // Initialize map centered on Uganda
      if (window.L && !mapInstanceRef.current) {
        const map = window.L.map(mapRef.current, {
          center: [1.3733, 32.2903], // Center of Uganda
          zoom: 7,
          zoomControl: true,
          scrollWheelZoom: true
        });

        // Add OpenStreetMap tiles
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map);

        // Add recycling center markers
        recyclingCenters.forEach(center => {
          const color = center.type === 'active' ? '#10B981' : 
                       center.type === 'collection' ? '#F59E0B' : '#EF4444';
          
          const marker = window.L.circleMarker([center.lat, center.lng], {
            radius: 8,
            fillColor: color,
            color: 'white',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
          }).addTo(map);

          // Add popup with center information
          marker.bindPopup(`
            <div style="font-family: system-ui, sans-serif;">
              <h4 style="margin: 0 0 8px 0; color: #1e293b;">${center.name}</h4>
              <p style="margin: 0; color: #64748b; font-size: 0.875rem;">
                Status: <span style="color: ${color}; font-weight: bold;">
                  ${center.type.charAt(0).toUpperCase() + center.type.slice(1)}
                </span>
              </p>
              <p style="margin: 4px 0 0 0; color: #64748b; font-size: 0.875rem;">
                Capacity: ${center.capacity}%
              </p>
            </div>
          `);
        });

        mapInstanceRef.current = map;
      }
    };

    loadLeaflet().catch(console.error);

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Simulate fetching user profile data
    console.log("Dashboard loaded");
  }, []);

  const totalMaterials = materials.reduce((sum, material) => sum + material.count, 0);
  const totalPoints = materials.reduce((sum, material) => sum + material.points, 0);

  const styles = {
    container: {
      backgroundColor: "#f8fafc",
      minHeight: "100vh",
      padding: "1rem",
      fontFamily: "system-ui, -apple-system, sans-serif"
    },
    dashboard: {
      maxWidth: "1200px",
      margin: "0 auto",
      width: "100%"
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "2rem",
      flexWrap: "wrap",
      gap: "1rem"
    },
    title: {
      fontSize: "2rem",
      fontWeight: "bold",
      color: "#1e293b",
      margin: 0
    },
    button: {
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
      transition: "all 0.2s"
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "1rem",
      marginBottom: "2rem"
    },
    card: {
      backgroundColor: "white",
      padding: "1.5rem",
      borderRadius: "12px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e2e8f0"
    },
    statCard: {
      display: "flex",
      alignItems: "center",
      gap: "1rem"
    },
    iconContainer: {
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white"
    },
    statValue: {
      fontSize: "2rem",
      fontWeight: "bold",
      color: "#1e293b",
      margin: 0
    },
    statLabel: {
      color: "#64748b",
      fontSize: "0.875rem",
      margin: "0.25rem 0 0 0"
    },
    mainGrid: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr",
      gap: "2rem",
      marginBottom: "2rem"
    },
    mapCard: {
      backgroundColor: "white",
      padding: "1.5rem",
      borderRadius: "12px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e2e8f0"
    },
    mapHeader: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      marginBottom: "1rem"
    },
    mapContainer: {
      height: "400px",
      borderRadius: "8px",
      border: "1px solid #e2e8f0",
      backgroundColor: "#f8fafc"
    },
    mapTitle: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      margin: "1rem 0 0.5rem 0"
    },
    mapSubtitle: {
      fontSize: "0.875rem",
      opacity: 0.9,
      margin: 0
    },
    marker: {
      position: "absolute",
      width: "12px",
      height: "12px",
      borderRadius: "50%",
      border: "2px solid white"
    },
    legend: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "1rem",
      flexWrap: "wrap",
      gap: "1rem"
    },
    legendItem: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem"
    },
    legendDot: {
      width: "12px",
      height: "12px",
      borderRadius: "50%"
    },
    progressBar: {
      height: "8px",
      backgroundColor: "#e2e8f0",
      borderRadius: "4px",
      position: "relative",
      marginTop: "0.5rem"
    },
    progressFill: {
      height: "100%",
      width: "75%",
      backgroundColor: "#3B82F6",
      borderRadius: "4px"
    },
    rewardItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0.75rem",
      backgroundColor: "#f8fafc",
      borderRadius: "6px",
      marginBottom: "0.5rem"
    },
    badge: {
      backgroundColor: "#dbeafe",
      color: "#1e40af",
      padding: "0.25rem 0.75rem",
      borderRadius: "12px",
      fontSize: "0.75rem",
      fontWeight: "500"
    },
    successBadge: {
      backgroundColor: "#dcfce7",
      color: "#166534"
    },
    materialsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "1rem",
      marginBottom: "1.5rem"
    },
    materialCard: {
      backgroundColor: "#f8fafc",
      padding: "1rem",
      borderRadius: "12px",
      textAlign: "center",
      border: "1px solid #e2e8f0"
    },
    materialIcon: {
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "white",
      margin: "0 auto 0.75rem auto"
    },
    materialCount: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      margin: "0.5rem 0"
    },
    divider: {
      border: "none",
      height: "1px",
      backgroundColor: "#e2e8f0",
      margin: "1.5rem 0"
    },
    summaryGrid: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "2rem",
      flexWrap: "wrap"
    },
    summaryItem: {
      textAlign: "center"
    },
    profileCard: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      padding: "1rem",
      backgroundColor: "#f8fafc",
      borderRadius: "8px"
    },
    avatar: {
      width: "50px",
      height: "50px",
      backgroundColor: "#3B82F6",
      borderRadius: "50%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "white",
      fontSize: "1.25rem",
      fontWeight: "bold"
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.dashboard}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Uganda Recycling Dashboard</h1>
          <button style={styles.button} onClick={signOut}>
            <LogOut size={18} />
            Sign Out
          </button>
        </div>

        {/* Stats Overview */}
        <div style={styles.statsGrid}>
          <div style={styles.card}>
            <div style={styles.statCard}>
              <div style={{...styles.iconContainer, backgroundColor: "#3B82F6"}}>
                <Coins size={24} />
              </div>
              <div>
                <div style={styles.statValue}>{rewards.points.toLocaleString()}</div>
                <div style={styles.statLabel}>Total Points</div>
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.statCard}>
              <div style={{...styles.iconContainer, backgroundColor: "#10B981"}}>
                <Recycle size={24} />
              </div>
              <div>
                <div style={styles.statValue}>{totalMaterials}</div>
                <div style={styles.statLabel}>Items Recycled</div>
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.statCard}>
              <div style={{...styles.iconContainer, backgroundColor: "#F59E0B"}}>
                <Award size={24} />
              </div>
              <div>
                <div style={styles.statValue}>{rewards.level}</div>
                <div style={styles.statLabel}>Current Level</div>
                <div style={{...styles.badge, ...styles.successBadge, marginTop: "0.5rem"}}>
                  {rewards.streak} day streak
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={{...styles.mainGrid, gridTemplateColumns: typeof window !== "undefined" && window.innerWidth < 1024 ? "1fr" : "2fr 1fr"}}>
          {/* Map Section */}
          <div style={styles.mapCard}>
            <div style={styles.mapHeader}>
              <MapPin size={24} color="#3B82F6" />
              <h3 style={{margin: 0, color: "#1e293b"}}>Uganda Recycling Centers</h3>
            </div>
            <div 
              ref={mapRef} 
              style={styles.mapContainer}
            />
            <div style={styles.legend}>
              <div style={styles.legendItem}>
                <div style={{...styles.legendDot, backgroundColor: "#10B981"}} />
                <span style={{fontSize: "0.875rem"}}>Active Centers ({recyclingCenters.filter(c => c.type === 'active').length})</span>
              </div>
              <div style={styles.legendItem}>
                <div style={{...styles.legendDot, backgroundColor: "#F59E0B"}} />
                <span style={{fontSize: "0.875rem"}}>Collection Points ({recyclingCenters.filter(c => c.type === 'collection').length})</span>
              </div>
              <div style={styles.legendItem}>
                <div style={{...styles.legendDot, backgroundColor: "#EF4444"}} />
                <span style={{fontSize: "0.875rem"}}>Full Capacity ({recyclingCenters.filter(c => c.type === 'full').length})</span>
              </div>
            </div>
          </div>

          {/* Rewards Section */}
          <div style={styles.card}>
            <div style={styles.mapHeader}>
              <Award size={24} color="#F59E0B" />
              <h3 style={{margin: 0, color: "#1e293b"}}>Rewards Status</h3>
            </div>
            
            <div style={{marginBottom: "1.5rem"}}>
              <div style={{fontSize: "1.125rem", fontWeight: "bold", color: "#1e293b"}}>
                Current Level: {rewards.level}
              </div>
              <div style={{color: "#64748b", fontSize: "0.875rem"}}>
                {rewards.points} points earned
              </div>
              
              {/* Progress bar */}
              <div style={{marginTop: "1rem"}}>
                <div style={{display: "flex", justifyContent: "space-between", marginBottom: "0.5rem"}}>
                  <span style={{fontSize: "0.875rem", color: "#64748b"}}>Progress to Platinum</span>
                  <span style={{fontSize: "0.875rem", color: "#64748b"}}>75%</span>
                </div>
                <div style={styles.progressBar}>
                  <div style={styles.progressFill} />
                </div>
              </div>
            </div>

            <hr style={styles.divider} />
            
            <div>
              <div style={{fontWeight: "bold", color: "#1e293b", marginBottom: "0.5rem"}}>
                Available Rewards
              </div>
              <div style={styles.rewardItem}>
                <span style={{fontSize: "0.875rem"}}>Mobile Money Credit</span>
                <span style={styles.badge}>500 pts</span>
              </div>
              <div style={styles.rewardItem}>
                <span style={{fontSize: "0.875rem"}}>Eco-friendly Bags</span>
                <span style={styles.badge}>200 pts</span>
              </div>
              <div style={styles.rewardItem}>
                <span style={{fontSize: "0.875rem"}}>Tree Planting Kit</span>
                <span style={styles.badge}>300 pts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Material Sorting Information */}
        <div style={styles.card}>
          <div style={styles.mapHeader}>
            <Package size={24} color="#8B5CF6" />
            <h3 style={{margin: 0, color: "#1e293b"}}>Material Sorting Overview</h3>
          </div>
          
          <div style={styles.materialsGrid}>
            {materials.map((material, index) => (
              <div key={index} style={styles.materialCard}>
                <div style={{...styles.materialIcon, backgroundColor: material.color}}>
                  <Trash2 size={24} />
                </div>
                <div style={{fontSize: "0.875rem", fontWeight: "bold", color: "#1e293b"}}>
                  {material.type}
                </div>
                <div style={{...styles.materialCount, color: material.color}}>
                  {material.count}
                </div>
                <div style={{fontSize: "0.75rem", color: "#64748b"}}>
                  items collected
                </div>
                <div style={{...styles.badge, ...styles.successBadge, marginTop: "0.5rem"}}>
                  +{material.points} pts
                </div>
              </div>
            ))}
          </div>
          
          <hr style={styles.divider} />
          
          <div style={styles.summaryGrid}>
            <div style={styles.summaryItem}>
              <div style={{fontSize: "1.5rem", fontWeight: "bold", color: "#1e293b"}}>
                {totalMaterials}
              </div>
              <div style={{fontSize: "0.875rem", color: "#64748b"}}>
                Total Items Recycled
              </div>
            </div>
            <div style={styles.summaryItem}>
              <div style={{fontSize: "1.5rem", fontWeight: "bold", color: "#10B981"}}>
                +{totalPoints}
              </div>
              <div style={{fontSize: "0.875rem", color: "#64748b"}}>
                Points Earned
              </div>
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        {userprofiles.length > 0 && (
          <div style={{...styles.card, marginTop: "2rem"}}>
            <h3 style={{color: "#1e293b", marginBottom: "1rem"}}>Profile Information</h3>
            {userprofiles.map((userprofile) => (
              <div key={userprofile.id || userprofile.email} style={styles.profileCard}>
                <div style={styles.avatar}>
                  {userprofile.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <div style={{fontWeight: "bold", color: "#1e293b"}}>
                    {userprofile.email}
                  </div>
                  <div style={{fontSize: "0.875rem", color: "#64748b"}}>
                    Active Recycler
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}