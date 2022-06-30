import { useHarperDB } from '../harper-provider';
import { TaskType } from './TaskItem';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import './DetailModal.css';
import { save } from 'ionicons/icons';
import { useState } from 'react';

export function DetailModal({
  task,
  onDismiss,
}: {
  task: TaskType;
  onDismiss: Function;
}) {
  const [state, setState] = useState(task.notes);
  const { execute } = useHarperDB();
  const updateTask = async () => {
    const sql = `UPDATE project.tasks SET notes="${state}" WHERE task_id="${task.task_id}"`;
    await execute({
      operation: 'sql',
      sql,
    });
    onDismiss();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{task.name}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={updateTask}>
              <IonIcon slot="icon-only" icon={save}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <ReactQuill theme="snow" value={state} onChange={setState} />
      </IonContent>
    </IonPage>
  );

  ///<div> it works, {JSON.stringify(task, null, 2)}</div>;
}
