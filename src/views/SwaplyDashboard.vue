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
          
          <!-- 3. ECharts - Pie Chart -->
          <div class="chart-card">
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
          
          <!-- 3. ECharts - Donut Chart -->
          <div class="chart-card">
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
    
    // Update intervals
    let businessUpdateInterval: number | null = null;
    let technicalUpdateInterval: number | null = null;
    let userActivityInterval: number | null = null;
    let dbPerformanceInterval: number | null = null;
    let memoryGaugeInterval: number | null = null;
    
    // Current memory usage for gauge
    let currentMemoryUsage = 65;
    
    // Business Stats data
    const businessStats = ref([
      {
        icon: cashOutline,
        value: '€0',
        label: 'Ingresos Totales',
        trend: '0%',
        trendIcon: arrowUpOutline,
        trendClass: 'positive'
      },
      {
        icon: peopleOutline,
        value: '0',
        label: 'Suscripciones',
        trend: '0%',
        trendIcon: arrowUpOutline,
        trendClass: 'positive'
      },
      {
        icon: cartOutline,
        value: '0',
        label: 'Ventas',
        trend: '0%',
        trendIcon: arrowUpOutline,
        trendClass: 'positive'
      },
      {
        icon: starOutline,
        value: '0',
        label: 'Valoración Media',
        trend: '0',
        trendIcon: arrowUpOutline,
        trendClass: 'positive'
      }
    ]);
    
    // Technical Stats data
    const technicalStats = ref([
      {
        icon: speedometerOutline,
        value: '0%',
        label: 'Uptime',
        trend: '0%',
        trendIcon: arrowUpOutline,
        trendClass: 'positive'
      },
      {
        icon: timeOutline,
        value: '0ms',
        label: 'Tiempo de Respuesta',
        trend: '0ms',
        trendIcon: arrowUpOutline,
        trendClass: 'positive'
      },
      {
        icon: alertCircleOutline,
        value: '0%',
        label: 'Tasa de Error',
        trend: '0%',
        trendIcon: arrowUpOutline,
        trendClass: 'positive'
      },
      {
        icon: cloudUploadOutline,
        value: '0',
        label: 'Despliegues',
        trend: '0',
        trendIcon: arrowUpOutline,
        trendClass: 'positive'
      }
    ]);
    
    // Generate random business data
    const generateBusinessData = () => {
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const userTypes = ['Nuevos', 'Recurrentes', 'Premium', 'Gratuitos'];
      
      // Generate sales data
      const salesData = months.map(() => Math.floor(Math.random() * 1000) + 200);
      
      // Update charts
      if (salesChartInstance) {
        salesChartInstance.data.datasets[0].data = salesData;
        salesChartInstance.update();
      }
      
      if (annualGrowthChartInstance) {
        annualGrowthChartInstance.updateSeries([{
          name: 'Crecimiento',
          data: months.map(() => Math.floor(Math.random() * 30) + 5)
        }]);
      }
      
      if (userDistributionChartInstance) {
        userDistributionChartInstance.setOption({
          series: [{
            data: [
              { value: Math.floor(Math.random() * 500) + 100, name: 'Nuevos' },
              { value: Math.floor(Math.random() * 500) + 100, name: 'Recurrentes' },
              { value: Math.floor(Math.random() * 500) + 100, name: 'Premium' },
              { value: Math.floor(Math.random() * 500) + 100, name: 'Gratuitos' }
            ]
          }]
        });
      }
      
      // Update sales goals chart
      if (salesGoalsChartInstance) {
        const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
        const targets = [1000000, 1200000, 1500000, 2000000];
        const currents = quarters.map((_, i) => Math.floor(Math.random() * (targets[i] * 1.2)));
        
        salesGoalsChartInstance.updateSeries([
          {
            name: 'Actual',
            data: currents
          },
          {
            name: 'Objetivo',
            data: targets
          }
        ]);
      }
      
      // Update stats
      const totalRevenue = Math.floor(Math.random() * 100000) + 10000;
      const subscriptions = Math.floor(Math.random() * 5000) + 1000;
      const sales = Math.floor(Math.random() * 20000) + 5000;
      const rating = (Math.random() * 1 + 4).toFixed(1);
      
      const revenueGrowth = (Math.random() * 30 + 5).toFixed(1);
      const subscriptionGrowth = (Math.random() * 200 + 50).toFixed(1);
      const salesGrowth = (Math.random() * 30 + 5).toFixed(1);
      const ratingChange = (Math.random() * 0.5).toFixed(1);
      
      businessStats.value[0].value = formatCurrency(totalRevenue);
      businessStats.value[0].trend = `${revenueGrowth}%`;
      businessStats.value[0].trendClass = parseFloat(revenueGrowth) > 0 ? 'positive' : 'negative';
      businessStats.value[0].trendIcon = parseFloat(revenueGrowth) > 0 ? arrowUpOutline : arrowDownOutline;
      
      businessStats.value[1].value = formatNumber(subscriptions);
      businessStats.value[1].trend = `${subscriptionGrowth}%`;
      businessStats.value[1].trendClass = parseFloat(subscriptionGrowth) > 0 ? 'positive' : 'negative';
      businessStats.value[1].trendIcon = parseFloat(subscriptionGrowth) > 0 ? arrowUpOutline : arrowDownOutline;
      
      businessStats.value[2].value = formatNumber(sales);
      businessStats.value[2].trend = `${salesGrowth}%`;
      businessStats.value[2].trendClass = parseFloat(salesGrowth) > 0 ? 'positive' : 'negative';
      businessStats.value[2].trendIcon = parseFloat(salesGrowth) > 0 ? arrowUpOutline : arrowDownOutline;
      
      businessStats.value[3].value = rating;
      businessStats.value[3].trend = `+${ratingChange}`;
      businessStats.value[3].trendClass = parseFloat(ratingChange) > 0 ? 'positive' : 'negative';
      businessStats.value[3].trendIcon = parseFloat(ratingChange) > 0 ? arrowUpOutline : arrowDownOutline;
    };
    
    // Generate random technical data
    const generateTechnicalData = () => {
      // Update server load chart
      if (serverLoadChartInstance) {
        const cpuData = Array.from({ length: 24 }, () => Math.floor(Math.random() * 30) + 40);
        const memoryData = Array.from({ length: 24 }, () => Math.floor(Math.random() * 30) + 50);
        
        serverLoadChartInstance.data.datasets[0].data = cpuData;
        serverLoadChartInstance.data.datasets[1].data = memoryData;
        serverLoadChartInstance.update();
      }
      
      // Update API response chart
      if (apiResponseChartInstance) {
        apiResponseChartInstance.updateSeries([{
          name: 'Tiempo de Respuesta (ms)',
          data: [
            Math.floor(Math.random() * 200) + 100,
            Math.floor(Math.random() * 200) + 100,
            Math.floor(Math.random() * 200) + 100,
            Math.floor(Math.random() * 200) + 100,
            Math.floor(Math.random() * 200) + 100,
            Math.floor(Math.random() * 200) + 100,
            Math.floor(Math.random() * 200) + 100
          ]
        }]);
      }
      
      // Update error types chart
      if (errorTypesChartInstance) {
        errorTypesChartInstance.setOption({
          series: [{
            data: [
              { value: Math.floor(Math.random() * 30) + 10, name: 'Red' },
              { value: Math.floor(Math.random() * 30) + 10, name: 'Autenticación' },
              { value: Math.floor(Math.random() * 30) + 10, name: 'Validación' },
              { value: Math.floor(Math.random() * 30) + 10, name: 'Base de Datos' },
              { value: Math.floor(Math.random() * 30) + 10, name: 'Servidor' }
            ]
          }]
        });
      }
      
      // Update stats
      const uptime = (99 + Math.random()).toFixed(1);
      const responseTime = Math.floor(Math.random() * 100) + 150;
      const errorRate = (Math.random() * 0.1).toFixed(2);
      const deployments = Math.floor(Math.random() * 20);
      
      const uptimeChange = (Math.random() * 0.5).toFixed(1);
      const responseTimeChange = Math.floor(Math.random() * 20);
      const errorRateChange = (Math.random() * 0.05).toFixed(2);
      const deploymentsChange = Math.floor(Math.random() * 5);
      
      technicalStats.value[0].value = `${uptime}%`;
      technicalStats.value[0].trend = `+${uptimeChange}%`;
      technicalStats.value[0].trendClass = 'positive';
      
      technicalStats.value[1].value = `${responseTime}ms`;
      technicalStats.value[1].trend = `-${responseTimeChange}ms`;
      technicalStats.value[1].trendClass = 'positive';
      
      technicalStats.value[2].value = `${errorRate}%`;
      technicalStats.value[2].trend = `-${errorRateChange}%`;
      technicalStats.value[2].trendClass = 'positive';
      
      technicalStats.value[3].value = `${deployments}`;
      technicalStats.value[3].trend = `+${deploymentsChange}`;
      technicalStats.value[3].trendClass = 'positive';
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
      
      // Random fluctuation between -5 and +5
      const fluctuation = Math.floor(Math.random() * 11) - 5;
      currentMemoryUsage = Math.max(0, Math.min(100, currentMemoryUsage + fluctuation));
      
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
              data: months.map(() => Math.floor(Math.random() * 1000) + 200),
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
                  color: '#333333' // Color más oscuro para las etiquetas
                }
              }
            },
            scales: {
              x: {
                ticks: {
                  color: '#333333' // Color más oscuro para las etiquetas del eje X
                },
                grid: {
                  color: '#dddddd' // Color más oscuro para las líneas de la cuadrícula
                }
              },
              y: {
                ticks: {
                  color: '#333333' // Color más oscuro para las etiquetas del eje Y
                },
                grid: {
                  color: '#dddddd' // Color más oscuro para las líneas de la cuadrícula
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
            data: months.map(() => Math.floor(Math.random() * 30) + 5)
          }],
          chart: {
            type: 'area',
            height: '100%',
            toolbar: {
              show: false
            },
            foreColor: '#333333' // Color más oscuro para el texto
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
                colors: '#333333' // Color más oscuro para las etiquetas del eje X
              }
            }
          },
          yaxis: {
            title: {
              text: 'Porcentaje (%)',
              style: {
                color: '#333333' // Color más oscuro para el título del eje Y
              }
            },
            labels: {
              style: {
                colors: '#333333' // Color más oscuro para las etiquetas del eje Y
              }
            }
          },
          grid: {
            borderColor: '#dddddd' // Color más oscuro para los bordes de la cuadrícula
          },
          legend: {
            labels: {
              colors: '#333333' // Color más oscuro para las etiquetas de la leyenda
            }
          }
        });
        
        annualGrowthChartInstance.render();
      }
      
      // 3. ECharts - Donut Chart (User Distribution)
      if (userDistributionChart.value && !userDistributionChartInstance) {
        // Asegurarse de que el contenedor tenga dimensiones
        userDistributionChart.value.style.width = '100%';
        userDistributionChart.value.style.height = '100%';
        
        // Inicializar ECharts después de asegurar que el DOM está listo
        nextTick(() => {
          userDistributionChartInstance = echarts.init(userDistributionChart.value);
          
          userDistributionChartInstance.setOption({
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)',
              textStyle: {
                color: '#333333' // Color más oscuro para el texto del tooltip
              }
            },
            legend: {
              orient: 'vertical',
              right: 10,
              top: 'center',
              data: ['Nuevos', 'Recurrentes', 'Premium', 'Gratuitos'],
              textStyle: {
                color: '#333333' // Color más oscuro para el texto de la leyenda
              }
            },
            color: ['#5b6bf9', '#4a9ff5', '#4ad9f5', '#b14cfa'],
            series: [
              {
                name: 'Usuarios',
                type: 'pie',
                radius: ['50%', '70%'], // Cambiado a donut como Tipos de Errores
                center: ['40%', '50%'], // Centrado para dejar espacio a la leyenda
                avoidLabelOverlap: false,
                itemStyle: {
                  borderRadius: 10,
                  borderColor: '#fff',
                  borderWidth: 2
                },
                label: {
                  show: false
                },
                emphasis: {
                  label: {
                    show: true,
                    fontSize: '18',
                    fontWeight: 'bold',
                    color: '#333333' // Color más oscuro para las etiquetas enfatizadas
                  }
                },
                labelLine: {
                  show: false
                },
                data: [
                  { value: 335, name: 'Nuevos' },
                  { value: 310, name: 'Recurrentes' },
                  { value: 234, name: 'Premium' },
                  { value: 135, name: 'Gratuitos' }
                ]
              }
            ]
          });
          
          // Asegurarse de que el gráfico se redimensione cuando cambie el tamaño de la ventana
          window.addEventListener('resize', () => {
            userDistributionChartInstance?.resize();
          });
        });
      }
      
      // 4. Nuevo gráfico para Objetivos de Ventas (ApexCharts - Column Chart)
      if (salesGoalsChart.value && !salesGoalsChartInstance) {
        const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
        const targets = [1000000, 1200000, 1500000, 2000000];
        const currents = quarters.map((_, i) => Math.floor(Math.random() * (targets[i] * 1.2)));
        
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
            foreColor: '#333333' // Color más oscuro para el texto
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
                colors: '#333333' // Color más oscuro para las etiquetas del eje X
              }
            }
          },
          yaxis: {
            title: {
              text: 'EUR',
              style: {
                color: '#333333' // Color más oscuro para el título del eje Y
              }
            },
            labels: {
              formatter: function (val) {
                return formatCurrency(val);
              },
              style: {
                colors: '#333333' // Color más oscuro para las etiquetas del eje Y
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
              colors: '#333333' // Color más oscuro para las etiquetas de la leyenda
            }
          },
          grid: {
            borderColor: '#dddddd' // Color más oscuro para los bordes de la cuadrícula
          }
        });
        
        salesGoalsChartInstance.render();
      }
      
      // 5. Real-time Chart - Line Chart (User Activity)
      if (userActivityChart.value && !userActivityChartInstance) {
        const initialData = Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 50);
        
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
                  color: '#333333' // Color más oscuro para las etiquetas del eje Y
                },
                grid: {
                  color: '#dddddd' // Color más oscuro para las líneas de la cuadrícula
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
        
        // Update real-time chart every 2 seconds
        if (!userActivityInterval) {
          userActivityInterval = window.setInterval(updateUserActivityChart, 2000);
        }
      }
      
      // Generate initial data
      generateBusinessData();
      
      // Set up interval to update data
      if (!businessUpdateInterval) {
        businessUpdateInterval = window.setInterval(generateBusinessData, 30000);
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
                data: hours.map(() => Math.floor(Math.random() * 30) + 40),
                borderColor: '#4a9ff5',
                backgroundColor: 'rgba(74, 159, 245, 0.1)',
                tension: 0.4,
                fill: true
              },
              {
                label: 'Memoria (%)',
                data: hours.map(() => Math.floor(Math.random() * 30) + 50),
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
                  color: '#333333' // Color más oscuro para las etiquetas
                }
              }
            },
            scales: {
              x: {
                ticks: {
                  color: '#333333' // Color más oscuro para las etiquetas del eje X
                },
                grid: {
                  color: '#dddddd' // Color más oscuro para las líneas de la cuadrícula
                }
              },
              y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                  color: '#333333' // Color más oscuro para las etiquetas del eje Y
                },
                grid: {
                  color: '#dddddd' // Color más oscuro para las líneas de la cuadrícula
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
            foreColor: '#333333' // Color más oscuro para el texto
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
                colors: '#333333' // Color más oscuro para las etiquetas del eje X
              }
            }
          },
          yaxis: {
            labels: {
              style: {
                colors: '#333333' // Color más oscuro para las etiquetas del eje Y
              }
            }
          },
          grid: {
            borderColor: '#dddddd' // Color más oscuro para los bordes de la cuadrícula
          }
        });
        
        apiResponseChartInstance.render();
      }
      
      // 3. ECharts - Donut Chart (Error Types)
      if (errorTypesChart.value && !errorTypesChartInstance) {
        // Asegurarse de que el contenedor tenga dimensiones
        errorTypesChart.value.style.width = '100%';
        errorTypesChart.value.style.height = '100%';
        
        // Inicializar ECharts después de asegurar que el DOM está listo
        nextTick(() => {
          errorTypesChartInstance = echarts.init(errorTypesChart.value);
          
          errorTypesChartInstance.setOption({
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)',
              textStyle: {
                color: '#333333' // Color más oscuro para el texto del tooltip
              }
            },
            legend: {
              orient: 'vertical',
              right: 10,
              top: 'center',
              data: ['Red', 'Autenticación', 'Validación', 'Base de Datos', 'Servidor'],
              textStyle: {
                color: '#333333' // Color más oscuro para el texto de la leyenda
              }
            },
            color: ['#4a9ff5', '#5b6bf9', '#4ad9f5', '#b14cfa', '#ff1a1a'],
            series: [
              {
                name: 'Tipos de Error',
                type: 'pie',
                radius: ['50%', '70%'],
                center: ['40%', '50%'], // Centrado para dejar espacio a la leyenda
                avoidLabelOverlap: false,
                itemStyle: {
                  borderRadius: 10,
                  borderColor: '#fff',
                  borderWidth: 2
                },
                label: {
                  show: false
                },
                emphasis: {
                  label: {
                    show: true,
                    fontSize: '18',
                    fontWeight: 'bold',
                    color: '#333333' // Color más oscuro para las etiquetas enfatizadas
                  }
                },
                labelLine: {
                  show: false
                },
                data: [
                  { value: 35, name: 'Red' },
                  { value: 25, name: 'Autenticación' },
                  { value: 20, name: 'Validación' },
                  { value: 15, name: 'Base de Datos' },
                  { value: 5, name: 'Servidor' }
                ]
              }
            ]
          });
          
          // Asegurarse de que el gráfico se redimensione cuando cambie el tamaño de la ventana
          window.addEventListener('resize', () => {
            errorTypesChartInstance?.resize();
          });
        });
      }
      
      // 4. Custom Chart - Gauge (Memory Usage)
      if (memoryUsageChart.value) {
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
        memoryUsageChart.value.innerHTML = '';
        memoryUsageChart.value.appendChild(gaugeContainer);
        
        // Update gauge initially
        updateMemoryGauge();
        
        // Set up interval to update gauge
        if (!memoryGaugeInterval) {
          memoryGaugeInterval = window.setInterval(updateMemoryGauge, 2000);
        }
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
                  color: '#dddddd' // Color más oscuro para las líneas angulares
                },
                grid: {
                  color: '#dddddd' // Color más oscuro para las líneas de la cuadrícula
                },
                pointLabels: {
                  color: '#333333' // Color más oscuro para las etiquetas de los puntos
                },
                ticks: {
                  color: '#333333', // Color más oscuro para las marcas
                  backdropColor: 'rgba(255, 255, 255, 0.75)' // Fondo más opaco para las marcas
                },
                suggestedMin: 0,
                suggestedMax: 100
              }
            },
            plugins: {
              legend: {
                labels: {
                  color: '#333333' // Color más oscuro para las etiquetas de la leyenda
                }
              }
            }
          }
        });
        
        // Update real-time chart every 3 seconds
        if (!dbPerformanceInterval) {
          dbPerformanceInterval = window.setInterval(updateDbPerformanceChart, 3000);
        }
      }
      
      // Generate initial data
      generateTechnicalData();
      
      // Set up interval to update data
      if (!technicalUpdateInterval) {
        technicalUpdateInterval = window.setInterval(generateTechnicalData, 30000);
      }
    };
    
    // Watch for segment changes
    watch(activeSegment, (newSegment) => {
      if (newSegment === 'business') {
        // Reinicializar gráficos de negocio si es necesario
        nextTick(() => {
          if (!salesChartInstance && salesChart.value) {
            initBusinessCharts();
          }
          
          // Asegurarse de que los gráficos de ECharts se redimensionen
          if (userDistributionChartInstance) {
            userDistributionChartInstance.resize();
          }
        });
      } else if (newSegment === 'technical') {
        // Reinicializar gráficos técnicos si es necesario
        nextTick(() => {
          if (!serverLoadChartInstance && serverLoadChart.value) {
            initTechnicalCharts();
          }
          
          // Asegurarse de que los gráficos de ECharts se redimensionen
          if (errorTypesChartInstance) {
            errorTypesChartInstance.resize();
          }
        });
      }
    });
    
    // Initialize both dashboards on mount
    onMounted(() => {
      // Initialize business charts first
      nextTick(() => {
        initBusinessCharts();
        
        // Initialize technical charts after a short delay
        setTimeout(() => {
          initTechnicalCharts();
        }, 300);
      });
      
      // Handle window resize for charts
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
      // Clear update intervals
      if (businessUpdateInterval) {
        clearInterval(businessUpdateInterval);
      }
      if (technicalUpdateInterval) {
        clearInterval(technicalUpdateInterval);
      }
      if (userActivityInterval) {
        clearInterval(userActivityInterval);
      }
      if (dbPerformanceInterval) {
        clearInterval(dbPerformanceInterval);
      }
      if (memoryGaugeInterval) {
        clearInterval(memoryGaugeInterval);
      }
      
      // Destroy chart instances - Business
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
      
      // Destroy chart instances - Technical
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
      // Business chart refs
      salesChart,
      annualGrowthChart,
      userDistributionChart,
      salesGoalsChart,
      userActivityChart,
      businessStats,
      // Technical chart refs
      serverLoadChart,
      apiResponseChart,
      errorTypesChart,
      memoryUsageChart,
      dbPerformanceChart,
      technicalStats,
      // Icons
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
  color: #333333; /* Color más oscuro para los valores */
}

.kpi-label {
  font-size: 12px;
  color: #555555; /* Color más oscuro para las etiquetas */
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

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-header h2 {
  font-size: 16px;
  font-weight: 600;
  color: #333333; /* Color más oscuro para los títulos */
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
}

@media (max-width: 480px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }
}
</style>