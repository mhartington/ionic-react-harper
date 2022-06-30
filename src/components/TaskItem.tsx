import {
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  useIonAlert,
  useIonModal,
} from '@ionic/react';
import { useRef } from 'react';
import { useHarperDB } from '../harper-provider';
import { DetailModal } from './DetailModal';
import './TaskItem.css';

export type TaskType = {
  __updatedtime__: number;
  status: string;
  notes?: string;
  __createdtime__: number;
  task_id: string;
  name: string;
};
export function TaskItem({
  task,
  onStatusDidChange,
}: {
  task: TaskType;
  onStatusDidChange: Function;
}) {
  const { execute } = useHarperDB();
  const slidingRef = useRef<HTMLIonItemSlidingElement | null>(null);
  const [presentAlert] = useIonAlert();

  const handleDismiss = () => {
    dismiss();
    onStatusDidChange();
  };

  const [presentModal, dismiss] = useIonModal(DetailModal, {
    task,
    onDismiss: handleDismiss,
  });

  const toggleStatus = () => {
    presentAlert({
      header: 'Change task status',
      inputs: [
        {
          name: 'Open',
          type: 'radio',
          label: 'Open',
          value: 'Open',
          checked: !!(task.status === 'Open'),
        },
        {
          name: 'In Progress',
          type: 'radio',
          label: 'In Progress',
          value: 'InProgress',
          checked: !!(task.status === 'InProgress'),
        },
        {
          name: 'Complete',
          type: 'radio',
          label: 'Complete',
          value: 'Complete',
          checked: !!(task.status === 'Complete'),
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
          const toStatus = ev.detail.data.values;
          const sql = `UPDATE project.tasks SET status="${toStatus}" WHERE task_id="${task.task_id}"`;
          await execute({ operation: 'sql', sql });
          slidingRef.current?.close();
          onStatusDidChange();
        }
      },
    });
  };
  const deleteTask = async () => {
    const sql = `DELETE FROM project.tasks WHERE task_id = '${task.task_id}'`;
    await execute({ operation: 'sql', sql });
    slidingRef.current?.close();
    onStatusDidChange();
  };
  return (
    <IonItemSliding ref={slidingRef} className={'status-' + task.status}>
      <IonItem onClick={() => presentModal()}>
        <IonLabel>{task.name}</IonLabel>
      </IonItem>
      <IonItemOptions side="end">
        <IonItemOption onClick={toggleStatus}>Status</IonItemOption>
        <IonItemOption color="danger" onClick={deleteTask}>
          Delete
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
}
