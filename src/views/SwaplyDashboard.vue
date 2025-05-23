<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title class="swaply-title">Swaply Dashboard</ion-title>
        <ion-buttons slot="end">
          <ion-button>
            <ion-icon slot="icon-only" :icon="calendarOutline"></ion-icon>
          </ion-button>
          <ion-button>
            <ion-icon slot="icon-only" :icon="downloadOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar>
        <ion-segment v-model="activeSegment">
          <ion-segment-button value="business">
            <ion-label>Business</ion-label>
            <ion-icon :icon="businessOutline"></ion-icon>
          </ion-segment-button>
          <ion-segment-button value="technical">
            <ion-label>Technical</ion-label>
            <ion-icon :icon="cogOutline"></ion-icon>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true">
      <!-- Business Dashboard -->
      <div v-if="activeSegment === 'business'" class="dashboard-container">
        <!-- KPI Cards -->
        <div class="kpi-grid">
          <div class="kpi-card business-card" v-for="(stat, index) in businessStats" :key="index">
            <div class="kpi-icon">
              <ion-icon :icon="stat.icon"></ion-icon>
            </div>
            <div class="kpi-content">
              <div class="kpi-value">{{ stat.value }}</div>
              <div class="kpi-label">{{ stat.label }}</div>
              <div class="kpi-trend" :class="stat.trendClass">
                <ion-icon :icon="stat.trendIcon"></ion-icon>
                {{ stat.trend }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Charts Grid -->
        <div class="charts-grid">
          <!-- 1. Chart.js - Bar Chart -->
          <div class="chart-card">
            <div class="chart-header">
              <h2>Ventas Mensuales</h2>
            </div>
            <div class="chart-container">
              <canvas ref="salesChart"></canvas>
            </div>
          </div>
          
          <!-- 2. ApexCharts - Area Chart -->
          <div class="chart-card">
            <div class="chart-header">
              <h2>Crecimiento Anual</h2>
            </div>
            <div class="chart-container">
              <div ref="annualGrowthChart"></div>
            </div>
          </div>
          
          <!-- 3. ECharts - Treemap (Ocupa 2 filas) -->
          <div class="chart-card chart-card-tall">
            <div class="chart-header">
              <h2>Distribución de Usuarios</h2>
            </div>
            <div class="chart-container">
              <div ref="userDistributionChart" class="full-size-chart"></div>
            </div>
          </div>
          
          <!-- 4. Nuevo gráfico para Objetivos de Ventas -->
          <div class="chart-card">
            <div class="chart-header">
              <h2>Objetivos de Ventas</h2>
            </div>
            <div class="chart-container">
              <div ref="salesGoalsChart" class="full-size-chart"></div>
            </div>
          </div>
          
          <!-- 5. Real-time Chart - Line Chart -->
          <div class="chart-card">
            <div class="chart-header">
              <h2>Actividad de Usuarios</h2>
              <div class="chart-badge">
                <ion-badge color="danger">Real-time</ion-badge>
              </div>
            </div>
            <div class="chart-container">
              <canvas ref="userActivityChart"></canvas>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Technical Dashboard -->
      <div v-if="activeSegment === 'technical'" class="dashboard-container">
        <!-- KPI Cards -->
        <div class="kpi-grid">
          <div class="kpi-card technical-card" v-for="(stat, index) in technicalStats" :key="index">
            <div class="kpi-icon">
              <ion-icon :icon="stat.icon"></ion-icon>
            </div>
            <div class="kpi-content">
              <div class="kpi-value">{{ stat.value }}</div>
              <div class="kpi-label">{{ stat.label }}</div>
              <div class="kpi-trend" :class="stat.trendClass">
                <ion-icon :icon="stat.trendIcon"></ion-icon>
                {{ stat.trend }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Charts Grid -->
        <div class="charts-grid">
          <!-- 1. Chart.js - Line Chart -->
          <div class="chart-card">
            <div class="chart-header">
              <h2>Carga del Servidor</h2>
            </div>
            <div class="chart-container">
              <canvas ref="serverLoadChart"></canvas>
            </div>
          </div>
          
          <!-- 2. ApexCharts - Bar Chart -->
          <div class="chart-card">
            <div class="chart-header">
              <h2>Tiempos de Respuesta API</h2>
            </div>
            <div class="chart-container">
              <div ref="apiResponseChart"></div>
            </div>
          </div>
          
          <!-- 3. ECharts - Treemap (Ocupa 2 filas) -->
          <div class="chart-card chart-card-tall">
            <div class="chart-header">
              <h2>Tipos de Errores</h2>
            </div>
            <div class="chart-container">
              <div ref="errorTypesChart" class="full-size-chart"></div>
            </div>
          </div>
          
          <!-- 4. Custom Chart - Gauge -->
          <div class="chart-card">
            <div class="chart-header">
              <h2>Uso de Memoria</h2>
            </div>
            <div class="chart-container">
              <div ref="memoryUsageChart" class="gauge-container"></div>
            </div>
          </div>
          
          <!-- 5. Real-time Chart - Radar Chart -->
          <div class="chart-card">
            <div class="chart-header">
              <h2>Rendimiento de Base de Datos</h2>
              <div class="chart-badge">
                <ion-badge color="danger">Real-time</ion-badge>
              </div>
            </div>
            <div class="chart-container">
              <canvas ref="dbPerformanceChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButtons, IonButton, IonIcon,
  IonSegment, IonSegmentButton, IonLabel, IonBadge
} from '@ionic/vue';
import { 
  calendarOutline, downloadOutline, peopleOutline, 
  cashOutline, cartOutline, pulseOutline, 
  arrowUpOutline, arrowDownOutline, businessOutline,
  cogOutline, speedometerOutline, timeOutline,
  alertCircleOutline, cloudUploadOutline, starOutline
} from 'ionicons/icons';
import { defineComponent, onMounted, ref, onUnmounted, watch, nextTick } from 'vue';
import { Chart, registerables } from 'chart.js';
import ApexCharts from 'apexcharts';
import * as echarts from 'echarts';

// Register Chart.js components
Chart.register(...registerables);

export default defineComponent({
  name: 'SwaplyDashboard',
  components: {
    IonPage, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonButtons, 
    IonButton, 
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonBadge
  },
  setup() {
    // Active segment
    const activeSegment = ref('business');
    
    // Chart references - Business
    const salesChart = ref<HTMLCanvasElement | null>(null);
    const annualGrowthChart = ref<HTMLElement | null>(null);
    const userDistributionChart = ref<HTMLElement | null>(null);
    const salesGoalsChart = ref<HTMLElement | null>(null);
    const userActivityChart = ref<HTMLCanvasElement | null>(null);
    
    // Chart references - Technical
    const serverLoadChart = ref<HTMLCanvasElement | null>(null);
    const apiResponseChart = ref<HTMLElement | null>(null);
    const errorTypesChart = ref<HTMLElement | null>(null);
    const memoryUsageChart = ref<HTMLElement | null>(null);
    const dbPerformanceChart = ref<HTMLCanvasElement | null>(null);
    
    // Chart instances - Business
    let salesChartInstance: Chart | null = null;
    let annualGrowthChartInstance: ApexCharts | null = null;
    let userDistributionChartInstance: echarts.ECharts | null = null;
    let salesGoalsChartInstance: ApexCharts | null = null;
    let userActivityChartInstance: Chart | null = null;
    
    // Chart instances - Technical
    let serverLoadChartInstance: Chart | null = null;
    let apiResponseChartInstance: ApexCharts | null = null;
    let errorTypesChartInstance: echarts.ECharts | null = null;
    let dbPerformanceChartInstance: Chart | null = null;
    
    // Update intervals - Solo para gráficos en tiempo real
    let userActivityInterval: number | null = null;
    let dbPerformanceInterval: number | null = null;
    
    // Current memory usage for gauge
    let currentMemoryUsage = 65;
    
    // Business Stats data
    const businessStats = ref([
      {
        icon: cashOutline,
        value: '€57.007',
        label: 'Ingresos Totales',
        trend: '25.5%',
        trendIcon: arrowUpOutline,
        trendClass: 'positive'
      },
      {
        icon: peopleOutline,
        value: '4.734',
        label: 'Suscripciones',
        trend: '108.9%',
        trendIcon: arrowUpOutline,
        trendClass: 'positive'
      },
      {
        icon: cartOutline,
        value: '21.720',
        label: 'Ventas',
        trend: '15.8%',
        trendIcon: arrowUpOutline,
        trendClass: 'positive'
      },
      {
        icon: starOutline,
        value: '4.7',
        label: 'Valoración Media',
        trend: '+0.4',
        trendIcon: arrowUpOutline,
        trendClass: 'positive'
      }
    ]);
    
    // Technical Stats data
    const technicalStats = ref([
      {
        icon: speedometerOutline,
        value: '99.8%',
        label: 'Uptime',
        trend: '+0.3%',
        trendIcon: arrowUpOutline,
        trendClass: 'positive'
      },
      {
        icon: timeOutline,
        value: '187ms',
        label: 'Tiempo de Respuesta',
        trend: '-12ms',
        trendIcon: arrowUpOutline,
        trendClass: 'positive'
      },
      {
        icon: alertCircleOutline,
        value: '0.05%',
        label: 'Tasa de Error',
        trend: '-0.02%',
        trendIcon: arrowUpOutline,
        trendClass: 'positive'
      },
      {
        icon: cloudUploadOutline,
        value: '14',
        label: 'Despliegues',
        trend: '+3',
        trendIcon: arrowUpOutline,
        trendClass: 'positive'
      }
    ]);
    
    // Format functions
    const formatCurrency = (value: number): string => {
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    };
    
    const formatNumber = (value: number): string => {
      return new Intl.NumberFormat('es-ES').format(value);
    };
    
    // Update user activity chart (real-time)
    const updateUserActivityChart = () => {
      if (userActivityChartInstance) {
        const data = userActivityChartInstance.data;
        if (data.datasets && data.datasets[0].data) {
          data.datasets[0].data.shift();
          data.datasets[0].data.push(Math.floor(Math.random() * 100) + 50);
          userActivityChartInstance.update();
        }
      }
    };
    
    // Update DB performance chart (real-time)
    const updateDbPerformanceChart = () => {
      if (dbPerformanceChartInstance) {
        dbPerformanceChartInstance.data.datasets[0].data = [
          Math.floor(Math.random() * 20) + 70,
          Math.floor(Math.random() * 20) + 70,
          Math.floor(Math.random() * 20) + 70,
          Math.floor(Math.random() * 20) + 70,
          Math.floor(Math.random() * 20) + 70,
          Math.floor(Math.random() * 20) + 70
        ];
        dbPerformanceChartInstance.update();
      }
    };
    
    // Update memory gauge
    const updateMemoryGauge = () => {
      if (!memoryUsageChart.value) return;
      
      const gaugeElement = memoryUsageChart.value;
      const gaugeFill = gaugeElement.querySelector('.gauge-fill') as HTMLElement;
      const gaugeText = gaugeElement.querySelector('.gauge-text') as HTMLElement;
      
      if (gaugeFill && gaugeText) {
        // Calculate rotation based on value (0-100)
        const rotation = currentMemoryUsage * 1.8 - 90; // 0 = -90deg, 100 = 90deg
        gaugeFill.style.transform = `rotate(${rotation}deg)`;
        
        // Set color based on value
        let color = '#4ad9f5'; // Light Blue/Cyan (low)
        if (currentMemoryUsage > 80) {
          color = '#ff1a1a'; // Bright Red (high)
        } else if (currentMemoryUsage > 60) {
          color = '#b14cfa'; // Purple (medium)
        }
        
        gaugeFill.style.backgroundColor = color;
        gaugeText.textContent = `${currentMemoryUsage}%`;
        gaugeText.style.color = color;
      }
    };
    
    // Initialize business charts
    const initBusinessCharts = () => {
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      
      // 1. Chart.js - Bar Chart (Sales)
      if (salesChart.value && !salesChartInstance) {
        salesChartInstance = new Chart(salesChart.value, {
          type: 'bar',
          data: {
            labels: months,
            datasets: [{
              label: 'Ventas',
              data: [1150, 1100, 350, 400, 950, 800, 420, 220, 1080, 980, 850, 350],
              backgroundColor: '#5b6bf9',
              borderColor: '#5b6bf9',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  color: '#333333'
                }
              }
            },
            scales: {
              x: {
                ticks: {
                  color: '#333333'
                },
                grid: {
                  color: '#dddddd'
                }
              },
              y: {
                ticks: {
                  color: '#333333'
                },
                grid: {
                  color: '#dddddd'
                }
              }
            }
          }
        });
      }
      
      // 2. ApexCharts - Area Chart (Annual Growth)
      if (annualGrowthChart.value && !annualGrowthChartInstance) {
        annualGrowthChartInstance = new ApexCharts(annualGrowthChart.value, {
          series: [{
            name: 'Crecimiento',
            data: [15, 6, 25, 14, 18, 17, 12, 11, 24, 15, 30, 25]
          }],
          chart: {
            type: 'area',
            height: '100%',
            toolbar: {
              show: false
            },
            foreColor: '#333333'
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'smooth',
            width: 2
          },
          colors: ['#4ad9f5'],
          fill: {
            type: 'gradient',
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.7,
              opacityTo: 0.2,
              stops: [0, 90, 100]
            }
          },
          xaxis: {
            categories: months,
            labels: {
              style: {
                colors: '#333333'
              }
            }
          },
          yaxis: {
            title: {
              text: 'Porcentaje (%)',
              style: {
                color: '#333333'
              }
            },
            labels: {
              style: {
                colors: '#333333'
              }
            }
          },
          grid: {
            borderColor: '#dddddd'
          },
          legend: {
            labels: {
              colors: '#333333'
            }
          }
        });
        
        annualGrowthChartInstance.render();
      }
      
      // 3. ECharts - Treemap (User Distribution)
      if (userDistributionChart.value && !userDistributionChartInstance) {
        userDistributionChart.value.style.width = '720%';
        userDistributionChart.value.style.height = '980%';
        
        nextTick(() => {
          userDistributionChartInstance = echarts.init(userDistributionChart.value);
          
          const userData = [
            { name: 'Nuevos', value: 335 },
            { name: 'Recurrentes', value: 310 },
            { name: 'Premium', value: 234 },
            { name: 'Gratuitos', value: 135 }
          ];
          
          const totalUsers = userData.reduce((sum, item) => sum + item.value, 0);
          
          userDistributionChartInstance.setOption({
            tooltip: {
              formatter: function(info: any) {
                const value = info.value;
                const percentage = ((value / totalUsers) * 100).toFixed(1);
                return `<div style="font-weight:bold;margin-bottom:5px;">${info.name}</div>` +
                       `<div>Usuarios: ${value}</div>` +
                       `<div>Porcentaje: ${percentage}%</div>`;
              }
            },
            series: [{
              type: 'treemap',
              data: userData.map(item => {
                const percentage = ((item.value / totalUsers) * 100).toFixed(1);
                return {
                  name: item.name,
                  value: item.value,
                  label: {
                    formatter: `{b}\n{c} (${percentage}%)`,
                    fontSize: 14
                  }
                };
              }),
              breadcrumb: { show: false },
              itemStyle: {
                borderColor: '#fff',
                borderWidth: 1,
                gapWidth: 1
              },
              label: {
                show: true,
                formatter: '{b}\n{c} ({d}%)',
                position: 'inside',
                fontSize: 14,
                color: '#fff'
              },
              upperLabel: {
                show: false
              },
              levels: [
                {
                  itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 2,
                    gapWidth: 2
                  }
                }
              ],
              colorRange: {
                color: ['#5b6bf9', '#4a9ff5', '#4ad9f5', '#b14cfa']
              },
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }]
          });
          
          window.addEventListener('resize', () => {
            userDistributionChartInstance?.resize();
          });
        });
      }
      
      // 4. Nuevo gráfico para Objetivos de Ventas (ApexCharts - Column Chart)
      if (salesGoalsChart.value && !salesGoalsChartInstance) {
        const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
        const targets = [1000000, 1200000, 1500000, 2000000];
        const currents = [480000, 520000, 1650000, 1500000];
        
        salesGoalsChartInstance = new ApexCharts(salesGoalsChart.value, {
          series: [
            {
              name: 'Actual',
              data: currents
            },
            {
              name: 'Objetivo',
              data: targets
            }
          ],
          chart: {
            type: 'bar',
            height: '100%',
            toolbar: {
              show: false
            },
            stacked: false,
            foreColor: '#333333'
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '55%',
              borderRadius: 5,
              dataLabels: {
                position: 'top'
              }
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
          },
          colors: ['#5b6bf9', '#4ad9f5'],
          xaxis: {
            categories: quarters,
            labels: {
              style: {
                colors: '#333333'
              }
            }
          },
          yaxis: {
            title: {
              text: 'EUR',
              style: {
                color: '#333333'
              }
            },
            labels: {
              formatter: function (val) {
                return formatCurrency(val);
              },
              style: {
                colors: '#333333'
              }
            }
          },
          fill: {
            opacity: 1
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return formatCurrency(val);
              }
            },
            theme: 'light',
            style: {
              fontSize: '12px',
              fontFamily: 'inherit'
            }
          },
          legend: {
            position: 'top',
            labels: {
              colors: '#333333'
            }
          },
          grid: {
            borderColor: '#dddddd'
          }
        });
        
        salesGoalsChartInstance.render();
      }
      
      // 5. Real-time Chart - Line Chart (User Activity)
      if (userActivityChart.value && !userActivityChartInstance) {
        const initialData = [120, 132, 101, 134, 90, 130, 110, 120, 132, 101, 134, 90, 130, 110, 120, 132, 101, 134, 90, 130, 110, 120, 132, 101, 134, 90, 130, 110, 120, 132];
        
        userActivityChartInstance = new Chart(userActivityChart.value, {
          type: 'line',
          data: {
            labels: Array.from({ length: 30 }, (_, i) => i.toString()),
            datasets: [{
              label: 'Usuarios Activos',
              data: initialData,
              fill: true,
              backgroundColor: 'rgba(177, 76, 250, 0.2)',
              borderColor: '#b14cfa',
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: false,
                min: 0,
                max: 200,
                ticks: {
                  color: '#333333'
                },
                grid: {
                  color: '#dddddd'
                }
              },
              x: {
                display: false
              }
            },
            animation: {
              duration: 0
            }
          }
        });
        
        if (!userActivityInterval) {
          userActivityInterval = window.setInterval(updateUserActivityChart, 2000);
        }
      }
    };
    
    // Initialize technical charts
    const initTechnicalCharts = () => {
      const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
      
      // 1. Chart.js - Line Chart (Server Load)
      if (serverLoadChart.value && !serverLoadChartInstance) {
        serverLoadChartInstance = new Chart(serverLoadChart.value, {
          type: 'line',
          data: {
            labels: hours,
            datasets: [
              {
                label: 'CPU (%)',
                data: [45, 52, 49, 60, 55, 58, 62, 65, 68, 62, 56, 52, 48, 50, 54, 59, 63, 67, 70, 65, 60, 55, 50, 47],
                borderColor: '#4a9ff5',
                backgroundColor: 'rgba(74, 159, 245, 0.1)',
                tension: 0.4,
                fill: true
              },
              {
                label: 'Memoria (%)',
                data: [60, 65, 68, 72, 75, 78, 80, 82, 79, 76, 72, 70, 68, 65, 68, 72, 75, 78, 80, 77, 74, 70, 67, 65],
                borderColor: '#ff1a1a',
                backgroundColor: 'rgba(255, 26, 26, 0.1)',
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
                labels: {
                  color: '#333333'
                }
              }
            },
            scales: {
              x: {
                ticks: {
                  color: '#333333'
                },
                grid: {
                  color: '#dddddd'
                }
              },
              y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                  color: '#333333'
                },
                grid: {
                  color: '#dddddd'
                }
              }
            }
          }
        });
      }
      
      // 2. ApexCharts - Bar Chart (API Response Times)
      if (apiResponseChart.value && !apiResponseChartInstance) {
        apiResponseChartInstance = new ApexCharts(apiResponseChart.value, {
          series: [{
            name: 'Tiempo de Respuesta (ms)',
            data: [320, 180, 400, 250, 150, 220, 280]
          }],
          chart: {
            type: 'bar',
            height: '100%',
            toolbar: {
              show: false
            },
            foreColor: '#333333'
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
          colors: ['#4a9ff5', '#5b6bf9', '#4ad9f5', '#b14cfa', '#ff1a1a', '#4a9ff5', '#5b6bf9'],
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
            labels: {
              style: {
                colors: '#333333'
              }
            }
          },
          yaxis: {
            labels: {
              style: {
                colors: '#333333'
              }
            }
          },
          grid: {
            borderColor: '#dddddd'
          }
        });
        
        apiResponseChartInstance.render();
      }
      
      // 3. ECharts - Treemap (Error Types)
      if (errorTypesChart.value && !errorTypesChartInstance) {
        errorTypesChart.value.style.width = '100%';
        errorTypesChart.value.style.height = '100%';
        
        nextTick(() => {
          errorTypesChartInstance = echarts.init(errorTypesChart.value);
          
          const errorData = [
            { name: 'Red', value: 35 },
            { name: 'Autenticación', value: 25 },
            { name: 'Validación', value: 20 },
            { name: 'Base de Datos', value: 15 },
            { name: 'Servidor', value: 5 }
          ];
          
          const totalErrors = errorData.reduce((sum, item) => sum + item.value, 0);
          
          errorTypesChartInstance.setOption({
            tooltip: {
              formatter: function(info: any) {
                const value = info.value;
                const percentage = ((value / totalErrors) * 100).toFixed(1);
                return `<div style="font-weight:bold;margin-bottom:5px;">${info.name}</div>` +
                       `<div>Errores: ${value}</div>` +
                       `<div>Porcentaje: ${percentage}%</div>`;
              }
            },
            series: [{
              type: 'treemap',
              data: errorData.map(item => {
                const percentage = ((item.value / totalErrors) * 100).toFixed(1);
                return {
                  name: item.name,
                  value: item.value,
                  label: {
                    formatter: `{b}\n{c} (${percentage}%)`,
                    fontSize: 14
                  }
                };
              }),
              breadcrumb: { show: false },
              itemStyle: {
                borderColor: '#fff',
                borderWidth: 1,
                gapWidth: 1
              },
              label: {
                show: true,
                formatter: '{b}\n{c} ({d}%)',
                position: 'inside',
                fontSize: 14,
                color: '#fff'
              },
              upperLabel: {
                show: false
              },
              levels: [
                {
                  itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 2,
                    gapWidth: 2
                  }
                }
              ],
              colorRange: {
                color: ['#4a9ff5', '#5b6bf9', '#4ad9f5', '#b14cfa', '#ff1a1a']
              },
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }]
          });
          
          window.addEventListener('resize', () => {
            errorTypesChartInstance?.resize();
          });
        });
      }
      
      // 4. Custom Chart - Gauge (Memory Usage)
      if (memoryUsageChart.value) {
        const gaugeContainer = document.createElement('div');
        gaugeContainer.className = 'gauge';
        
        const gaugeValue = document.createElement('div');
        gaugeValue.className = 'gauge-value';
        
        const gaugeFill = document.createElement('div');
        gaugeFill.className = 'gauge-fill';
        
        const gaugeText = document.createElement('div');
        gaugeText.className = 'gauge-text';
        
        gaugeValue.appendChild(gaugeFill);
        gaugeContainer.appendChild(gaugeValue);
        gaugeContainer.appendChild(gaugeText);
        memoryUsageChart.value.innerHTML = '';
        memoryUsageChart.value.appendChild(gaugeContainer);
        
        updateMemoryGauge();
      }
      
      // 5. Real-time Chart - Radar Chart (DB Performance)
      if (dbPerformanceChart.value && !dbPerformanceChartInstance) {
        dbPerformanceChartInstance = new Chart(dbPerformanceChart.value, {
          type: 'radar',
          data: {
            labels: [
              'Velocidad de Consulta',
              'Velocidad de Escritura',
              'Pool de Conexiones',
              'Tasa de Aciertos de Caché',
              'Uso de Índices',
              'Tasa de Transacciones'
            ],
            datasets: [{
              label: 'Actual',
              data: [85, 75, 90, 80, 85, 70],
              fill: true,
              backgroundColor: 'rgba(91, 107, 249, 0.2)',
              borderColor: '#5b6bf9',
              pointBackgroundColor: '#5b6bf9',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: '#5b6bf9'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            elements: {
              line: {
                borderWidth: 3
              }
            },
            scales: {
              r: {
                angleLines: {
                  color: '#dddddd'
                },
                grid: {
                  color: '#dddddd'
                },
                pointLabels: {
                  color: '#333333'
                },
                ticks: {
                  color: '#333333',
                  backdropColor: 'rgba(255, 255, 255, 0.75)'
                },
                suggestedMin: 0,
                suggestedMax: 100
              }
            },
            plugins: {
              legend: {
                labels: {
                  color: '#333333'
                }
              }
            }
          }
        });
        
        if (!dbPerformanceInterval) {
          dbPerformanceInterval = window.setInterval(updateDbPerformanceChart, 3000);
        }
      }
    };
    
    // Watch for segment changes
    watch(activeSegment, (newSegment) => {
      if (newSegment === 'business') {
        nextTick(() => {
          if (!salesChartInstance && salesChart.value) {
            initBusinessCharts();
          }
          
          if (userDistributionChartInstance) {
            userDistributionChartInstance.resize();
          }
        });
      } else if (newSegment === 'technical') {
        nextTick(() => {
          if (!serverLoadChartInstance && serverLoadChart.value) {
            initTechnicalCharts();
          }
          
          if (errorTypesChartInstance) {
            errorTypesChartInstance.resize();
          }
        });
      }
    });
    
    // Initialize both dashboards on mount
    onMounted(() => {
      nextTick(() => {
        initBusinessCharts();
        
        setTimeout(() => {
          initTechnicalCharts();
        }, 300);
      });
      
      window.addEventListener('resize', () => {
        if (userDistributionChartInstance) {
          userDistributionChartInstance.resize();
        }
        if (errorTypesChartInstance) {
          errorTypesChartInstance.resize();
        }
        if (annualGrowthChartInstance) {
          annualGrowthChartInstance.render();
        }
        if (apiResponseChartInstance) {
          apiResponseChartInstance.render();
        }
        if (salesGoalsChartInstance) {
          salesGoalsChartInstance.render();
        }
      });
    });
    
    // Clean up on unmount
    onUnmounted(() => {
      if (userActivityInterval) {
        clearInterval(userActivityInterval);
      }
      if (dbPerformanceInterval) {
        clearInterval(dbPerformanceInterval);
      }
      
      salesChartInstance?.destroy();
      if (annualGrowthChartInstance) {
        annualGrowthChartInstance.destroy();
      }
      if (userDistributionChartInstance) {
        userDistributionChartInstance.dispose();
      }
      if (salesGoalsChartInstance) {
        salesGoalsChartInstance.destroy();
      }
      userActivityChartInstance?.destroy();
      
      serverLoadChartInstance?.destroy();
      if (apiResponseChartInstance) {
        apiResponseChartInstance.destroy();
      }
      if (errorTypesChartInstance) {
        errorTypesChartInstance.dispose();
      }
      dbPerformanceChartInstance?.destroy();
    });
    
    return {
      activeSegment,
      salesChart,
      annualGrowthChart,
      userDistributionChart,
      salesGoalsChart,
      userActivityChart,
      businessStats,
      serverLoadChart,
      apiResponseChart,
      errorTypesChart,
      memoryUsageChart,
      dbPerformanceChart,
      technicalStats,
      calendarOutline,
      downloadOutline,
      businessOutline,
      cogOutline,
      arrowUpOutline,
      arrowDownOutline
    };
  }
});
</script>

<style scoped>
/* Header styling */
ion-toolbar {
  --background: var(--ion-color-secondary);
  --color: white;
}

.swaply-title {
  font-weight: bold;
  color: white;
}

/* Content styling */
ion-content {
  --background: #f8f9fa;
}

.dashboard-container {
  padding: 16px;
  max-width: 100%;
  height: calc(100vh - 104px); /* Altura total menos el header (2 toolbars) */
  display: flex;
  flex-direction: column;
}

/* KPI cards grid */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.kpi-card {
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.business-card {
  border-left: 4px solid var(--ion-color-secondary);
}

.technical-card {
  border-left: 4px solid var(--ion-color-success);
}

.kpi-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  background-color: rgba(91, 107, 249, 0.1);
}

.kpi-icon ion-icon {
  font-size: 24px;
  color: var(--ion-color-secondary);
}

.kpi-content {
  flex: 1;
}

.kpi-value {
  font-size: 20px;
  font-weight: 700;
  color: #333333;
}

.kpi-label {
  font-size: 12px;
  color: #555555;
  margin: 4px 0;
}

.kpi-trend {
  font-size: 12px;
  display: flex;
  align-items: center;
}

.kpi-trend ion-icon {
  margin-right: 4px;
  font-size: 14px;
}

.kpi-trend.positive {
  color: var(--ion-color-success);
}

.kpi-trend.negative {
  color: var(--ion-color-danger);
}

/* Charts grid */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 16px;
  flex: 1;
}

.chart-card {
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Clase especial para gráficos que ocupan 2 filas */
.chart-card-tall {
  grid-row: span 2; /* Esto hace que el elemento ocupe 2 filas */
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-header h2 {
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin: 0;
}

.chart-badge {
  display: flex;
  align-items: center;
}

.chart-container {
  flex: 1;
  position: relative;
  width: 100%;
  height: 100%;
}

.full-size-chart {
  width: 100%;
  height: 100%;
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
  width: 150px;
  height: 75px;
  overflow: hidden;
}

.gauge-value {
  position: absolute;
  width: 150px;
  height: 150px;
  top: 75px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
}

.gauge-fill {
  position: absolute;
  width: 150px;
  height: 150px;
  transform-origin: center top;
  transform: rotate(-90deg);
  background-color: var(--ion-color-success);
  transition: transform 0.5s ease-out, background-color 0.5s ease-out;
}

.gauge-text {
  position: absolute;
  width: 100%;
  text-align: center;
  top: 45px;
  font-size: 20px;
  font-weight: 700;
  color: var(--ion-color-success);
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .charts-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(5, 1fr);
  }
  
  .chart-card-tall {
    grid-row: span 1; /* En móvil, vuelve a ocupar solo 1 fila */
  }
}

@media (max-width: 480px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }
}
</style>