import {
    IonButton,
    IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonAlert,
  useIonViewDidEnter,
} from '@ionic/react';
import { add } from 'ionicons/icons';
import { useState } from 'react';
import LoadingIndicator from '../components/LoadingIndicator';
import { TaskItem, TaskType } from '../components/TaskItem';
import { useHarperDB } from '../harper-provider';
import './Home.css';

const Home: React.FC = () => {
  const { execute } = useHarperDB();
  const [state, setState] = useState({ data: [], isLoading: true });
  useIonViewDidEnter(() => {
    loadData();
  });
  const loadData = async () => {
    const { data } = await execute({
      operation: 'sql',
      sql: `select * from project.tasks`,
    });
    setState({ data, isLoading: false });
  };


  const [presentAlert] = useIonAlert();
  const newTask = async () =>{

    presentAlert({
      header: 'Add a new task',
      inputs: [
        {
          name: 'task_name',
          type: 'text',
          label: 'Task name',
          value: '',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Ok',
          role: 'confirm',
        },
      ],
      onDidDismiss: async (ev) => {
        if (ev.detail.role === 'confirm') {
          const {task_name } = ev.detail.data.values;
          console.log(task_name)
          const sql = `INSERT INTO project.tasks (name,status)  VALUE ('${task_name}', 'Open')`;
          await execute({ operation: 'sql', sql });
          await loadData();
        }
      },
    });
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Tasks</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={newTask}>
              <IonIcon slot="icon-only" icon={add}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">My Tasks</IonTitle>
          </IonToolbar>
        </IonHeader>
        {state.isLoading ? <LoadingIndicator /> : null}
        {state.data && state.data.length > 0
          ? state.data.map((t: TaskType, i: number) => (
              <TaskItem task={t} key={i} onStatusDidChange={loadData} />
            ))
          : null}
      </IonContent>
    </IonPage>
  );
};

export default Home;
