<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Business Dashboard</ion-title>
        <ion-buttons slot="end">
          <ion-button>
            <ion-icon slot="icon-only" :icon="calendarOutline"></ion-icon>
          </ion-button>
          <ion-button>
            <ion-icon slot="icon-only" :icon="downloadOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true">
      <div class="container">
        <div class="dashboard-header">
          <h1>Business Analytics</h1>
          <p>Insights for business stakeholders and market analysis</p>
        </div>
        
        <div class="kpi-row">
          <div class="kpi-card">
            <div class="kpi-icon">
              <ion-icon :icon="peopleOutline"></ion-icon>
            </div>
            <div class="kpi-content">
              <div class="kpi-value">12,458</div>
              <div class="kpi-label">Active Users</div>
              <div class="kpi-trend positive">+12.5%</div>
            </div>
          </div>
          
          <div class="kpi-card">
            <div class="kpi-icon">
              <ion-icon :icon="cartOutline"></ion-icon>
            </div>
            <div class="kpi-content">
              <div class="kpi-value">3,254</div>
              <div class="kpi-label">Transactions</div>
              <div class="kpi-trend positive">+8.3%</div>
            </div>
          </div>
          
          <div class="kpi-card">
            <div class="kpi-icon">
              <ion-icon :icon="cashOutline"></ion-icon>
            </div>
            <div class="kpi-content">
              <div class="kpi-value">€145,320</div>
              <div class="kpi-label">GMV</div>
              <div class="kpi-trend positive">+15.2%</div>
            </div>
          </div>
          
          <div class="kpi-card">
            <div class="kpi-icon">
              <ion-icon :icon="starOutline"></ion-icon>
            </div>
            <div class="kpi-content">
              <div class="kpi-value">4.7</div>
              <div class="kpi-label">Avg. Rating</div>
              <div class="kpi-trend positive">+0.2</div>
            </div>
          </div>
        </div>
        
        <div class="chart-grid">
          <!-- Chart 1: User Acquisition (Line Chart - Chart.js) -->
          <div class="chart-card">
            <div class="chart-header">
              <h2>User Acquisition</h2>
              <div class="chart-actions">
                <ion-button fill="clear" size="small">Monthly</ion-button>
                <ion-button fill="clear" size="small">Quarterly</ion-button>
                <ion-button fill="clear" size="small">Yearly</ion-button>
              </div>
            </div>
            <div class="chart-container">
              <canvas ref="userAcquisitionChart"></canvas>
            </div>
          </div>
          
          <!-- Chart 2: Category Popularity (Bar Chart - Custom) -->
          <div class="chart-card">
            <div class="chart-header">
              <h2>Category Popularity</h2>
              <div class="chart-actions">
                <ion-button fill="clear" size="small">
                  <ion-icon slot="icon-only" :icon="ellipsisHorizontal"></ion-icon>
                </ion-button>
              </div>
            </div>
            <div class="chart-container">
              <div ref="categoryChart" class="custom-chart"></div>
            </div>
          </div>
          
          <!-- Chart 3: Geographic Distribution (Heatmap - ECharts) -->
          <div class="chart-card">
            <div class="chart-header">
              <h2>Geographic Distribution</h2>
              <div class="chart-actions">
                <ion-button fill="clear" size="small">
                  <ion-icon slot="icon-only" :icon="ellipsisHorizontal"></ion-icon>
                </ion-button>
              </div>
            </div>
            <div class="chart-container">
              <div ref="geoChart" style="height: 100%; width: 100%;"></div>
            </div>
          </div>
          
          <!-- Chart 4: Sales Performance (Area Chart - ApexCharts) -->
          <div class="chart-card">
            <div class="chart-header">
              <h2>Sales Performance</h2>
              <div class="chart-actions">
                <ion-button fill="clear" size="small">Weekly</ion-button>
                <ion-button fill="clear" size="small">Monthly</ion-button>
              </div>
            </div>
            <div class="chart-container">
              <div ref="salesChart"></div>
            </div>
          </div>
          
          <!-- Chart 5: User Engagement (Real-time Chart) -->
          <div class="chart-card">
            <div class="chart-header">
              <h2>User Engagement (Real-time)</h2>
              <div class="chart-actions">
                <ion-badge color="success">Live</ion-badge>
              </div>
            </div>
            <div class="chart-container">
              <canvas ref="engagementChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonBadge, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { defineComponent, onMounted, ref } from 'vue';
import { calendarOutline, cartOutline, cashOutline, downloadOutline, ellipsisHorizontal, peopleOutline, starOutline } from 'ionicons/icons';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import ApexCharts from 'apexcharts';
import * as echarts from 'echarts';

export default defineComponent({
  name: 'BusinessDashboard',
  components: {
    IonBadge,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar
  },
  setup() {
    const userAcquisitionChart = ref<HTMLCanvasElement | null>(null);
    const categoryChart = ref<HTMLElement | null>(null);
    const geoChart = ref<HTMLElement | null>(null);
    const salesChart = ref<HTMLElement | null>(null);
    const engagementChart = ref<HTMLCanvasElement | null>(null);
    
    let userChart: Chart | null = null;
    let realTimeChart: Chart | null = null;
    let apexSalesChart: ApexCharts | null = null;
    let echartsInstance: echarts.ECharts | null = null;
    
    onMounted(() => {
      // Chart 1: User Acquisition (Chart.js)
      if (userAcquisitionChart.value) {
        userChart = new Chart(userAcquisitionChart.value, {
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
              {
                label: 'New Users',
                data: [1200, 1350, 1250, 1420, 1550, 1680, 1810, 1950, 2100, 2250, 2400, 2580],
                borderColor: '#4a9ff5', // Frame 1 - Medium Blue
                backgroundColor: 'rgba(74, 159, 245, 0.1)',
                tension: 0.4,
                fill: true
              },
              {
                label: 'Returning Users',
                data: [800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1250, 1300, 1350],
                borderColor: '#5b6bf9', // Frame 2 - Deeper Blue
                backgroundColor: 'rgba(91, 107, 249, 0.1)',
                tension: 0.4,
                fill: true
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                mode: 'index',
                intersect: false,
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  drawBorder: false,
                }
              },
              x: {
                grid: {
                  display: false
                }
              }
            }
          }
        });
      }
      
      // Chart 2: Category Popularity (Custom Chart)
      if (categoryChart.value) {
        const categories = [
          { name: 'Electronics', value: 32, color: '#4a9ff5' }, // Frame 1
          { name: 'Clothing', value: 27, color: '#5b6bf9' }, // Frame 2
          { name: 'Home & Garden', value: 21, color: '#4ad9f5' }, // Frame 3
          { name: 'Sports', value: 14, color: '#b14cfa' }, // Frame 5
          { name: 'Collectibles', value: 6, color: '#ff1a1a' } // Frame 4
        ];
        
        const maxValue = Math.max(...categories.map(c => c.value));
        const barHeight = 30;
        const barGap = 15;
        const labelWidth = 120;
        const valueWidth = 40;
        
        let html = '';
        
        categories.forEach((category, index) => {
          const barWidth = (category.value / maxValue) * (categoryChart.value!.clientWidth - labelWidth - valueWidth - 20);
          
          html += `
            <div class="custom-bar" style="margin-top: ${index > 0 ? barGap : 0}px;">
              <div class="custom-bar-label">${category.name}</div>
              <div class="custom-bar-container">
                <div class="custom-bar-fill" style="width: ${barWidth}px; background-color: ${category.color};"></div>
              </div>
              <div class="custom-bar-value">${category.value}%</div>
            </div>
          `;
        });
        
        categoryChart.value.innerHTML = html;
      }
      
      // Chart 3: Geographic Distribution (ECharts)
      if (geoChart.value) {
        echartsInstance = echarts.init(geoChart.value);
        
        // Since we don't have Spain map registered, we'll use a pie chart for demo
        echartsInstance.setOption({
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            left: 'left'
          },
          color: ['#4a9ff5', '#5b6bf9', '#4ad9f5', '#b14cfa', '#ff1a1a'], // Using our color palette
          series: [
            {
              name: 'User Distribution',
              type: 'pie',
              radius: '70%',
              data: [
                { value: 189, name: 'Madrid' },
                { value: 177, name: 'Barcelona' },
                { value: 142, name: 'Valencia' },
                { value: 123, name: 'Seville' },
                { value: 98, name: 'Other Cities' }
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        });
        
        window.addEventListener('resize', () => {
          echartsInstance?.resize();
        });
      }
      
      // Chart 4: Sales Performance (ApexCharts)
      if (salesChart.value) {
        const options = {
          series: [{
            name: 'Sales',
            data: [31, 40, 28, 51, 42, 109, 100, 120, 80, 95, 110, 130]
          }],
          chart: {
            height: 300,
            type: 'area',
            toolbar: {
              show: false
            }
          },
          colors: ['#4ad9f5'], // Frame 3 - Light Blue/Cyan
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'smooth',
            width: 2
          },
          xaxis: {
            type: 'category',
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          },
          tooltip: {
            x: {
              format: 'dd/MM/yy HH:mm'
            },
          },
          fill: {
            type: 'gradient',
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.7,
              opacityTo: 0.2,
              stops: [0, 90, 100]
            }
          }
        };
        
        apexSalesChart = new ApexCharts(salesChart.value, options);
        apexSalesChart.render();
      }
      
      // Chart 5: User Engagement (Real-time Chart)
      if (engagementChart.value) {
        const data = {
          labels: Array.from({ length: 30 }, (_, i) => i.toString()),
          datasets: [
            {
              label: 'Active Users',
              data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 50),
              borderColor: '#b14cfa', // Frame 5 - Purple
              backgroundColor: 'rgba(177, 76, 250, 0.1)',
              fill: true,
              tension: 0.4
            }
          ]
        };
        
        realTimeChart = new Chart(engagementChart.value, {
          type: 'line',
          data: data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: false,
                min: 0,
                max: 200
              },
              x: {
                display: false
              }
            },
            plugins: {
              legend: {
                display: false
              }
            },
            animation: {
              duration: 0
            }
          }
        });
        
        // Update real-time chart every 2 seconds
        setInterval(() => {
          if (realTimeChart) {
            const data = realTimeChart.data;
            if (data.datasets && data.datasets[0].data) {
              data.datasets[0].data.shift();
              data.datasets[0].data.push(Math.floor(Math.random() * 100) + 50);
              realTimeChart.update();
            }
          }
        }, 2000);
      }
    });
    
    return {
      userAcquisitionChart,
      categoryChart,
      geoChart,
      salesChart,
      engagementChart,
      calendarOutline,
      downloadOutline,
      peopleOutline,
      cartOutline,
      cashOutline,
      starOutline,
      ellipsisHorizontal
    }
  }
});
</script>

<style scoped>
ion-header ion-toolbar {
  --background: #5b6bf9;
  --color: white;
}

ion-content {
  --background: #4a9ff5;
}

ion-button {
  --color: white;
}

.container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 10px;
}

.dashboard-header h1 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 5px;
  color: white;
}

.dashboard-header p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.kpi-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.kpi-card {
  background-color: #b14cfa;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.kpi-icon {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.kpi-icon ion-icon {
  font-size: 24px;
  color: white;
}

.kpi-content {
  flex: 1;
}

.kpi-value {
  font-size: 20px;
  font-weight: 700;
  color: white;
}

.kpi-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  margin: 2px 0;
}

.kpi-trend {
  font-size: 12px;
  font-weight: 600;
}

.kpi-trend.positive {
  color: white;
}

.kpi-trend.negative {
  color: #ff1a1a;
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 20px;
}

.chart-card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  height: 400px;
  display: flex;
  flex-direction: column;
  border-top: 4px solid #4ad9f5;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.chart-header h2 {
  font-size: 16px;
  font-weight: 600;
  color: #5b6bf9;
  margin: 0;
}

.chart-container {
  flex: 1;
  position: relative;
}

/* Custom chart styles */
.custom-chart {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.custom-bar {
  display: flex;
  align-items: center;
  height: 30px;
}

.custom-bar-label {
  width: 120px;
  font-size: 12px;
  color: var(--ion-color-medium);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.custom-bar-container {
  flex: 1;
  height: 10px;
  background-color: var(--ion-color-light);
  border-radius: 5px;
  overflow: hidden;
}

.custom-bar-fill {
  height: 100%;
  border-radius: 5px;
}

.custom-bar-value {
  width: 40px;
  text-align: right;
  font-size: 12px;
  font-weight: 600;
  color: var(--ion-color-dark);
  margin-left: 10px;
}

@media (max-width: 768px) {
  .chart-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-card {
    height: 350px;
  }
}
</style>
