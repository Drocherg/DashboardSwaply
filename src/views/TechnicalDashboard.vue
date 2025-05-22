<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Technical Dashboard</ion-title>
        <ion-buttons slot="end">
          <ion-button>
            <ion-icon slot="icon-only" :icon="refreshOutline"></ion-icon>
          </ion-button>
          <ion-button>
            <ion-icon slot="icon-only" :icon="alertCircleOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true">
      <div class="container">
        <div class="dashboard-header">
          <h1>Technical Analytics</h1>
          <p>System performance and internal metrics for developers</p>
        </div>
        
        <div class="kpi-row">
          <div class="kpi-card">
            <div class="kpi-icon">
              <ion-icon :icon="speedometerOutline"></ion-icon>
            </div>
            <div class="kpi-content">
              <div class="kpi-value">99.8%</div>
              <div class="kpi-label">Uptime</div>
              <div class="kpi-trend positive">+0.2%</div>
            </div>
          </div>
          
          <div class="kpi-card">
            <div class="kpi-icon">
              <ion-icon :icon="timeOutline"></ion-icon>
            </div>
            <div class="kpi-content">
              <div class="kpi-value">245ms</div>
              <div class="kpi-label">Avg. Response Time</div>
              <div class="kpi-trend positive">-12ms</div>
            </div>
          </div>
          
          <div class="kpi-card">
            <div class="kpi-icon">
              <ion-icon :icon="alertCircleOutline"></ion-icon>
            </div>
            <div class="kpi-content">
              <div class="kpi-value">0.05%</div>
              <div class="kpi-label">Error Rate</div>
              <div class="kpi-trend positive">-0.02%</div>
            </div>
          </div>
          
          <div class="kpi-card">
            <div class="kpi-icon">
              <ion-icon :icon="cloudUploadOutline"></ion-icon>
            </div>
            <div class="kpi-content">
              <div class="kpi-value">12</div>
              <div class="kpi-label">Deployments</div>
              <div class="kpi-trend neutral">0</div>
            </div>
          </div>
        </div>
        
        <div class="chart-grid">
          <!-- Chart 1: Server Load (Line Chart - Chart.js) -->
          <div class="chart-card">
            <div class="chart-header">
              <h2>Server Load</h2>
              <div class="chart-actions">
                <ion-button fill="clear" size="small">24h</ion-button>
                <ion-button fill="clear" size="small">7d</ion-button>
                <ion-button fill="clear" size="small">30d</ion-button>
              </div>
            </div>
            <div class="chart-container">
              <canvas ref="serverLoadChart"></canvas>
            </div>
          </div>
          
          <!-- Chart 2: API Response Times (Bar Chart - ApexCharts) -->
          <div class="chart-card">
            <div class="chart-header">
              <h2>API Response Times</h2>
              <div class="chart-actions">
                <ion-button fill="clear" size="small">
                  <ion-icon slot="icon-only" :icon="ellipsisHorizontal"></ion-icon>
                </ion-button>
              </div>
            </div>
            <div class="chart-container">
              <div ref="apiResponseChart"></div>
            </div>
          </div>
          
          <!-- Chart 3: Error Types (Pie Chart - ECharts) -->
          <div class="chart-card">
            <div class="chart-header">
              <h2>Error Types</h2>
              <div class="chart-actions">
                <ion-button fill="clear" size="small">
                  <ion-icon slot="icon-only" :icon="ellipsisHorizontal"></ion-icon>
                </ion-button>
              </div>
            </div>
            <div class="chart-container">
              <div ref="errorTypesChart" style="height: 100%; width: 100%;"></div>
            </div>
          </div>
          
          <!-- Chart 4: Database Performance (Radar Chart - Chart.js) -->
          <div class="chart-card">
            <div class="chart-header">
              <h2>Database Performance</h2>
              <div class="chart-actions">
                <ion-button fill="clear" size="small">
                  <ion-icon slot="icon-only" :icon="ellipsisHorizontal"></ion-icon>
                </ion-button>
              </div>
            </div>
            <div class="chart-container">
              <canvas ref="dbPerformanceChart"></canvas>
            </div>
          </div>
          
          <!-- Chart 5: Memory Usage (Real-time Gauge - Custom) -->
          <div class="chart-card">
            <div class="chart-header">
              <h2>Memory Usage (Real-time)</h2>
              <div class="chart-actions">
                <ion-badge color="success">Live</ion-badge>
              </div>
            </div>
            <div class="chart-container">
              <div ref="memoryUsageChart" class="gauge-container"></div>
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
import { alertCircleOutline, cloudUploadOutline, ellipsisHorizontal, refreshOutline, speedometerOutline, timeOutline } from 'ionicons/icons';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import ApexCharts from 'apexcharts';
import * as echarts from 'echarts';

export default defineComponent({
  name: 'TechnicalDashboard',
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
    const serverLoadChart = ref<HTMLCanvasElement | null>(null);
    const apiResponseChart = ref<HTMLElement | null>(null);
    const errorTypesChart = ref<HTMLElement | null>(null);
    const dbPerformanceChart = ref<HTMLCanvasElement | null>(null);
    const memoryUsageChart = ref<HTMLElement | null>(null);
    
    let serverChart: Chart | null = null;
    let dbChart: Chart | null = null;
    let apexApiChart: ApexCharts | null = null;
    let echartsInstance: echarts.ECharts | null = null;
    let currentMemoryUsage = 65; // Starting value
    
    onMounted(() => {
      // Chart 1: Server Load (Chart.js)
      if (serverLoadChart.value) {
        const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
        
        serverChart = new Chart(serverLoadChart.value, {
          type: 'line',
          data: {
            labels: hours,
            datasets: [
              {
                label: 'CPU Load (%)',
                data: [45, 42, 40, 38, 43, 48, 55, 60, 65, 70, 68, 72, 75, 70, 68, 65, 70, 75, 80, 78, 75, 70, 65, 60],
                borderColor: '#4a9ff5', // Frame 1 - Medium Blue
                backgroundColor: 'rgba(74, 159, 245, 0.1)',
                tension: 0.4,
                fill: true,
                yAxisID: 'y'
              },
              {
                label: 'Memory Usage (%)',
                data: [60, 58, 55, 52, 50, 55, 62, 68, 72, 75, 78, 80, 82, 80, 78, 75, 78, 82, 85, 82, 80, 75, 70, 65],
                borderColor: '#ff1a1a', // Frame 4 - Bright Red
                backgroundColor: 'rgba(255, 26, 26, 0.1)',
                tension: 0.4,
                fill: true,
                yAxisID: 'y'
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
                max: 100,
                title: {
                  display: true,
                  text: 'Percentage (%)'
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
      
      // Chart 2: API Response Times (ApexCharts)
      if (apiResponseChart.value) {
        const options = {
          series: [{
            name: 'Response Time (ms)',
            data: [320, 180, 400, 250, 150, 220, 280]
          }],
          chart: {
            type: 'bar',
            height: 300,
            toolbar: {
              show: false
            }
          },
          plotOptions: {
            bar: {
              horizontal: true,
              barHeight: '50%',
              distributed: true,
              dataLabels: {
                position: 'bottom'
              },
            }
          },
          colors: ['#4a9ff5', '#5b6bf9', '#4ad9f5', '#b14cfa', '#ff1a1a', '#4a9ff5', '#5b6bf9'], // Using our color palette
          dataLabels: {
            enabled: true,
            textAnchor: 'start',
            style: {
              colors: ['#fff']
            },
            formatter: function (val: number) {
              return val + ' ms';
            },
            offsetX: 0
          },
          xaxis: {
            categories: ['/api/users', '/api/products', '/api/search', '/api/messages', '/api/categories', '/api/transactions', '/api/auth'],
          },
          yaxis: {
            labels: {
              show: true
            }
          },
          tooltip: {
            theme: 'dark',
            x: {
              show: false
            },
            y: {
              title: {
                formatter: function () {
                  return 'Response Time:';
                }
              }
            }
          }
        };
        
        apexApiChart = new ApexCharts(apiResponseChart.value, options);
        apexApiChart.render();
      }
      
      // Chart 3: Error Types (ECharts)
      if (errorTypesChart.value) {
        echartsInstance = echarts.init(errorTypesChart.value);
        
        echartsInstance.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 10,
            data: ['Network', 'Authentication', 'Validation', 'Database', 'Server']
          },
          color: ['#4a9ff5', '#5b6bf9', '#4ad9f5', '#b14cfa', '#ff1a1a'], // Using our color palette
          series: [
            {
              name: 'Error Types',
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '18',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: [
                { value: 35, name: 'Network' },
                { value: 25, name: 'Authentication' },
                { value: 20, name: 'Validation' },
                { value: 15, name: 'Database' },
                { value: 5, name: 'Server' }
              ]
            }
          ]
        });
        
        window.addEventListener('resize', () => {
          echartsInstance?.resize();
        });
      }
      
      // Chart 4: Database Performance (Radar Chart)
      if (dbPerformanceChart.value) {
        dbChart = new Chart(dbPerformanceChart.value, {
          type: 'radar',
          data: {
            labels: [
              'Query Speed',
              'Write Speed',
              'Connection Pool',
              'Cache Hit Rate',
              'Index Usage',
              'Transaction Rate'
            ],
            datasets: [{
              label: 'Current',
              data: [85, 75, 90, 80, 85, 70],
              fill: true,
              backgroundColor: 'rgba(91, 107, 249, 0.2)', // Frame 2 - Deeper Blue
              borderColor: '#5b6bf9',
              pointBackgroundColor: '#5b6bf9',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: '#5b6bf9'
            }, {
              label: 'Previous Week',
              data: [80, 70, 85, 75, 80, 65],
              fill: true,
              backgroundColor: 'rgba(177, 76, 250, 0.2)', // Frame 5 - Purple
              borderColor: '#b14cfa',
              pointBackgroundColor: '#b14cfa',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: '#b14cfa'
            }]
          },
          options: {
            elements: {
              line: {
                borderWidth: 3
              }
            },
            scales: {
              r: {
                angleLines: {
                  display: true
                },
                suggestedMin: 0,
                suggestedMax: 100
              }
            }
          }
        });
      }
      
      // Chart 5: Memory Usage (Custom Gauge)
      if (memoryUsageChart.value) {
        const createGauge = () => {
          const gaugeElement = memoryUsageChart.value!;
          gaugeElement.innerHTML = '';
          
          // Create gauge elements
          const gaugeContainer = document.createElement('div');
          gaugeContainer.className = 'gauge';
          
          const gaugeValue = document.createElement('div');
          gaugeValue.className = 'gauge-value';
          
          const gaugeFill = document.createElement('div');
          gaugeFill.className = 'gauge-fill';
          
          const gaugeText = document.createElement('div');
          gaugeText.className = 'gauge-text';
          
          // Append elements
          gaugeValue.appendChild(gaugeFill);
          gaugeContainer.appendChild(gaugeValue);
          gaugeContainer.appendChild(gaugeText);
          gaugeElement.appendChild(gaugeContainer);
          
          // Update gauge
          updateGauge(currentMemoryUsage);
        };
        
        const updateGauge = (value: number) => {
          const gaugeElement = memoryUsageChart.value!;
          const gaugeFill = gaugeElement.querySelector('.gauge-fill') as HTMLElement;
          const gaugeText = gaugeElement.querySelector('.gauge-text') as HTMLElement;
          
          if (gaugeFill && gaugeText) {
            // Calculate rotation based on value (0-100)
            const rotation = value * 1.8 - 90; // 0 = -90deg, 100 = 90deg
            gaugeFill.style.transform = `rotate(${rotation}deg)`;
            
            // Set color based on value
            let color = '#4ad9f5'; // Frame 3 - Light Blue/Cyan (low)
            if (value > 80) {
              color = '#ff1a1a'; // Frame 4 - Bright Red (high)
            } else if (value > 60) {
              color = '#b14cfa'; // Frame 5 - Purple (medium)
            }
            
            gaugeFill.style.backgroundColor = color;
            gaugeText.textContent = `${value}%`;
            gaugeText.style.color = color;
          }
        };
        
        // Create initial gauge
        createGauge();
        
        // Update gauge every 2 seconds with random fluctuations
        setInterval(() => {
          // Random fluctuation between -5 and +5
          const fluctuation = Math.floor(Math.random() * 11) - 5;
          currentMemoryUsage = Math.max(0, Math.min(100, currentMemoryUsage + fluctuation));
          updateGauge(currentMemoryUsage);
        }, 2000);
      }
    });
    
    return {
      serverLoadChart,
      apiResponseChart,
      errorTypesChart,
      dbPerformanceChart,
      memoryUsageChart,
      refreshOutline,
      alertCircleOutline,
      speedometerOutline,
      timeOutline,
      cloudUploadOutline,
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

.kpi-card {
  background-color: #4ad9f5;
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

.kpi-trend.positive {
  color: white;
}

.kpi-trend.negative {
  color: #ff1a1a;
}

.kpi-trend.neutral {
  color: rgba(255, 255, 255, 0.7);
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
  border-top: 4px solid #b14cfa;
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

/* Gauge chart styles */
.gauge-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.gauge {
  position: relative;
  width: 200px;
  height: 100px;
  overflow: hidden;
}

.gauge-value {
  position: absolute;
  width: 200px;
  height: 200px;
  top: 100px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
}

.gauge-fill {
  position: absolute;
  width: 200px;
  height: 200px;
  transform-origin: center top;
  transform: rotate(-90deg);
  background-color: var(--ion-color-success);
  transition: transform 0.5s ease-out, background-color 0.5s ease-out;
}

.gauge-text {
  position: absolute;
  width: 100%;
  text-align: center;
  top: 60px;
  font-size: 24px;
  font-weight: 700;
  color: var(--ion-color-success);
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
