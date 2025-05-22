<template>
  <ion-app>
    <ion-split-pane content-id="main-content" when="md">
      <ion-menu content-id="main-content" type="overlay" class="narrow-menu">
        <ion-content>
          <ion-list id="inbox-list">
            <ion-list-header>SWAPLY Dashboard</ion-list-header>

            <ion-menu-toggle auto-hide="false" v-for="(p, i) in appPages" :key="i">
              <ion-item @click="selectedIndex = i" router-direction="root" :router-link="p.url" lines="none" detail="false" class="hydrated" :class="{ selected: selectedIndex === i }">
                <ion-icon slot="start" :ios="p.iosIcon" :md="p.mdIcon"></ion-icon>
                <ion-label>{{ p.title }}</ion-label>
              </ion-item>
            </ion-menu-toggle>
          </ion-list>
        </ion-content>
      </ion-menu>
      <ion-router-outlet id="main-content"></ion-router-outlet>
    </ion-split-pane>
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonContent, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuToggle, IonRouterOutlet, IonSplitPane } from '@ionic/vue';
import { defineComponent, ref } from 'vue';
import { businessOutline, businessSharp, cogOutline, cogSharp } from 'ionicons/icons';

export default defineComponent({
  name: 'App',
  components: {
    IonApp, 
    IonContent, 
    IonIcon, 
    IonItem, 
    IonLabel, 
    IonList, 
    IonListHeader, 
    IonMenu, 
    IonMenuToggle, 
    IonRouterOutlet, 
    IonSplitPane
  },
  setup() {
    const selectedIndex = ref(0);
    const appPages = [
      {
        title: 'Business Dashboard',
        url: '/business',
        iosIcon: businessOutline,
        mdIcon: businessSharp
      },
      {
        title: 'Technical Dashboard',
        url: '/technical',
        iosIcon: cogOutline,
        mdIcon: cogSharp
      }
    ];
    
    return {
      selectedIndex,
      appPages
    }
  }
});
</script>

<style scoped>
ion-menu {
  --width: 200px; /* Narrower sidebar */
}

.narrow-menu ion-list-header {
  font-size: 18px;
  font-weight: 600;
  min-height: 20px;
  padding: 10px 10px 20px 10px;
}

ion-menu ion-content {
  --background: linear-gradient(135deg, #5b6bf9, #4a9ff5);
}

ion-menu.md ion-content {
  --padding-start: 8px;
  --padding-end: 8px;
  --padding-top: 20px;
  --padding-bottom: 20px;
}

ion-menu.md ion-list {
  padding: 20px 0;
}

ion-menu.md ion-list#inbox-list {
  border-bottom: 1px solid var(--ion-color-step-150, #d7d8da);
}

ion-menu.md ion-item {
  --padding-start: 10px;
  --padding-end: 10px;
  border-radius: 4px;
  --background: transparent;
  --color: white;
}

ion-menu.md ion-item.selected {
  --background: rgba(255, 255, 255, 0.2);
}

ion-menu.md ion-item.selected ion-icon {
  color: white;
}

ion-menu.md ion-item ion-icon {
  color: rgba(255, 255, 255, 0.8);
}

ion-menu.md ion-item ion-label {
  font-weight: 500;
}

ion-menu.ios ion-content {
  --padding-bottom: 20px;
}

ion-menu.ios ion-list {
  padding: 20px 0 0 0;
}

ion-menu.ios ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --min-height: 50px;
}

ion-menu.ios ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.ios ion-item ion-icon {
  font-size: 24px;
  color: #73849a;
}

ion-menu.ios ion-list-header {
  margin-bottom: 8px;
}

ion-menu.ios ion-list-header,
ion-menu.ios ion-note {
  padding-left: 16px;
  padding-right: 16px;
}

ion-item.selected {
  --color: white;
}

ion-menu ion-list-header {
  color: white;
}
</style>
