# İş Akışı (Workflow) Yönetimi Modülü

## 1. Modülün Amacı ve Kapsamı
İş Akışı Yönetimi modülü, şirketin iş süreçlerinin dijital ortamda tanımlanmasını, otomatikleştirilmesini ve takibini sağlar. Onay süreçleri, iş akışları, form yönetimi ve süreç optimizasyonu işlemlerini kapsar. Tüm modüller arasında ortak kullanılan bir süreç yönetim altyapısı sunar.

## 2. Temel Kavramlar ve Terimler
- **Workflow:** Belirli bir iş sürecinin adım adım tanımlandığı akış.
- **Process:** Bir iş akışının çalışan örneği.
- **Task:** İş akışındaki tek bir görev veya adım.
- **Approval:** Onay süreci, bir görevin onaylanması gereken durumu.
- **Form:** Veri girişi için kullanılan dijital form.
- **Condition:** İş akışında karar verme noktası.
- **Timer:** Zaman bazlı tetikleyiciler.

## 3. Ana Fonksiyonlar ve Ekranlar
- **Workflow Designer:** Görsel iş akışı tasarım aracı.
- **Process Management:** İş akışı tanımlama ve yönetimi.
- **Task Management:** Görev atama ve takibi.
- **Form Builder:** Dinamik form oluşturma aracı.
- **Process Monitoring:** Süreç performansı ve analizi.
- **Approval Management:** Onay süreçleri yönetimi.

## 4. Sık Kullanılan İşlemler
### 4.1 Yeni İş Akışı Oluşturma
1. "Workflow Designer" ekranına girin.
2. "Yeni Workflow" butonuna tıklayın.
3. Workflow adı ve açıklamasını girin.
4. Adımları sürükle-bırak ile ekleyin.
5. Koşulları ve geçişleri tanımlayın.
6. "Kaydet" ile workflow'u oluşturun.

### 4.2 Görev Atama
1. "Task Management" ekranına girin.
2. Bekleyen görevleri görüntüleyin.
3. İlgili görevi seçin.
4. Gerekli bilgileri doldurun.
5. "Tamamla" veya "Onayla" butonuna tıklayın.

### 4.3 Süreç Takibi
1. "Process Monitoring" ekranına girin.
2. Aktif süreçleri görüntüleyin.
3. Süreç detaylarını inceleyin.
4. Performans metriklerini analiz edin.

## 5. İş Akışı Bileşenleri

### 5.1 Başlangıç Noktası (Start Event)
- Manuel tetikleme
- Zaman bazlı tetikleme
- Sistem olayı tetikleme
- E-posta tetikleme

### 5.2 Görevler (Tasks)
- **User Task:** Kullanıcı tarafından yapılacak görev
- **Service Task:** Sistem tarafından otomatik yapılacak görev
- **Script Task:** Kod çalıştırma görevi
- **Manual Task:** Manuel işlem gerektiren görev

### 5.3 Karar Noktaları (Gateways)
- **Exclusive Gateway:** Tek yönlü karar
- **Parallel Gateway:** Paralel işlem
- **Inclusive Gateway:** Koşullu paralel işlem
- **Event Gateway:** Olay bazlı karar

### 5.4 Bitiş Noktası (End Event)
- Normal bitiş
- Hata ile bitiş
- İptal ile bitiş

## 6. Form Yönetimi

### 6.1 Form Builder
```javascript
// Form tanımı örneği
const formDefinition = {
  id: "purchase-request",
  name: "Satın Alma Talebi",
  fields: [
    {
      id: "item-name",
      type: "text",
      label: "Ürün Adı",
      required: true,
      validation: {
        minLength: 3,
        maxLength: 100
      }
    },
    {
      id: "quantity",
      type: "number",
      label: "Miktar",
      required: true,
      validation: {
        min: 1
      }
    },
    {
      id: "urgency",
      type: "select",
      label: "Acil Durum",
      options: [
        { value: "low", label: "Düşük" },
        { value: "medium", label: "Orta" },
        { value: "high", label: "Yüksek" }
      ]
    }
  ]
};
```

### 6.2 Dinamik Form Render
```javascript
// Form render işlemi
class FormRenderer {
  renderForm(formDefinition) {
    const form = document.createElement('form');
    
    formDefinition.fields.forEach(field => {
      const fieldElement = this.createField(field);
      form.appendChild(fieldElement);
    });
    
    return form;
  }
  
  createField(fieldDef) {
    switch(fieldDef.type) {
      case 'text':
        return this.createTextField(fieldDef);
      case 'number':
        return this.createNumberField(fieldDef);
      case 'select':
        return this.createSelectField(fieldDef);
      // ... diğer field tipleri
    }
  }
}
```

## 7. Onay Süreçleri

### 7.1 Onay Hiyerarşisi
```javascript
// Onay hiyerarşisi tanımı
const approvalHierarchy = {
  type: "hierarchical",
  levels: [
    {
      level: 1,
      role: "department_manager",
      amountLimit: 10000
    },
    {
      level: 2,
      role: "finance_manager",
      amountLimit: 50000
    },
    {
      level: 3,
      role: "general_manager",
      amountLimit: null // Sınırsız
    }
  ]
};
```

### 7.2 Onay Akışı
```javascript
// Onay süreci işleme
class ApprovalProcessor {
  async processApproval(taskId, decision, comments) {
    const task = await this.taskService.getTask(taskId);
    const process = await this.processService.getProcess(task.processId);
    
    if (decision === 'approve') {
      await this.moveToNextStep(process, task);
    } else if (decision === 'reject') {
      await this.rejectProcess(process, task, comments);
    }
    
    await this.notifyStakeholders(task, decision);
  }
  
  async moveToNextStep(process, currentTask) {
    const nextTask = this.workflowEngine.getNextTask(process, currentTask);
    
    if (nextTask) {
      await this.taskService.createTask(nextTask);
    } else {
      await this.completeProcess(process);
    }
  }
}
```

## 8. İş Akışı Motoru

### 8.1 Workflow Engine
```javascript
// Workflow engine örneği
class WorkflowEngine {
  async startProcess(workflowId, data) {
    const workflow = await this.workflowService.getWorkflow(workflowId);
    const process = await this.createProcess(workflow, data);
    
    const startEvent = workflow.getStartEvent();
    const firstTask = this.getNextTask(startEvent);
    
    await this.taskService.createTask(firstTask, process.id);
    
    return process;
  }
  
  async executeTask(taskId, data) {
    const task = await this.taskService.getTask(taskId);
    const process = await this.processService.getProcess(task.processId);
    
    // Task'ı çalıştır
    await this.executeTaskLogic(task, data);
    
    // Sonraki adımları belirle
    const nextTasks = this.getNextTasks(task, data);
    
    for (const nextTask of nextTasks) {
      await this.taskService.createTask(nextTask, process.id);
    }
    
    // Mevcut task'ı tamamla
    await this.taskService.completeTask(taskId);
  }
}
```

### 8.2 BPMN 2.0 Desteği
```xml
<!-- BPMN 2.0 XML örneği -->
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL">
  <bpmn:process id="purchase-approval" name="Satın Alma Onay Süreci">
    <bpmn:startEvent id="start" name="Başlangıç">
      <bpmn:outgoing>flow1</bpmn:outgoing>
    </bpmn:startEvent>
    
    <bpmn:userTask id="review" name="İnceleme">
      <bpmn:incoming>flow1</bpmn:incoming>
      <bpmn:outgoing>flow2</bpmn:outgoing>
    </bpmn:userTask>
    
    <bpmn:exclusiveGateway id="decision" name="Onay Kararı">
      <bpmn:incoming>flow2</bpmn:incoming>
      <bpmn:outgoing>flow3</bpmn:outgoing>
      <bpmn:outgoing>flow4</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    
    <bpmn:endEvent id="approved" name="Onaylandı">
      <bpmn:incoming>flow3</bpmn:incoming>
    </bpmn:endEvent>
    
    <bpmn:endEvent id="rejected" name="Reddedildi">
      <bpmn:incoming>flow4</bpmn:incoming>
    </bpmn:endEvent>
  </bpmn:process>
</bpmn:definitions>
```

## 9. Entegrasyonlar

### 9.1 E-posta Entegrasyonu
```javascript
// E-posta bildirimi
class EmailNotificationService {
  async sendTaskNotification(task, user) {
    const emailTemplate = await this.getEmailTemplate('task-assignment');
    const emailContent = this.renderTemplate(emailTemplate, {
      taskName: task.name,
      processName: task.processName,
      dueDate: task.dueDate,
      taskUrl: `${process.env.APP_URL}/tasks/${task.id}`
    });
    
    await this.emailService.send({
      to: user.email,
      subject: `Yeni Görev: ${task.name}`,
      html: emailContent
    });
  }
}
```

### 9.2 Sistem Entegrasyonları
- **Muhasebe Modülü:** Fatura onay süreçleri
- **İK Modülü:** İzin onay süreçleri
- **Satın Alma:** Satın alma talebi onayları
- **CRM:** Müşteri onay süreçleri

## 10. Raporlama ve Analitik

### 10.1 Süreç Metrikleri
- **Cycle Time:** Süreç tamamlanma süresi
- **Lead Time:** Görev bekleme süresi
- **Throughput:** Birim zamanda tamamlanan süreç sayısı
- **Bottleneck Analysis:** Darboğaz analizi

### 10.2 Performans Dashboard
```javascript
// Performans metrikleri
class PerformanceMetrics {
  async getProcessMetrics(processId, dateRange) {
    const processes = await this.processService.getProcesses(processId, dateRange);
    
    return {
      totalProcesses: processes.length,
      completedProcesses: processes.filter(p => p.status === 'completed').length,
      averageCycleTime: this.calculateAverageCycleTime(processes),
      averageLeadTime: this.calculateAverageLeadTime(processes),
      bottleneckTasks: this.identifyBottlenecks(processes)
    };
  }
}
```

## 11. Sıkça Sorulan Sorular (SSS)
- **İş akışı değiştirilebilir mi?**
  - Evet, workflow designer ile değiştirilebilir.
- **Görevler otomatik atanabilir mi?**
  - Evet, rol ve yetki bazlı otomatik atama yapılabilir.
- **Süreç geçmişi saklanır mı?**
  - Evet, tüm süreç geçmişi tam olarak saklanır.

## 12. Teknik Detaylar
### API Örnekleri
- **Workflow Başlatma:**
  ```http
  POST /api/workflow/v1/processes
  Content-Type: application/json
  {
    "workflowId": "purchase-approval",
    "data": {
      "amount": 25000,
      "description": "Bilgisayar alımı"
    }
  }
  ```
- **Görev Tamamlama:**
  ```http
  POST /api/workflow/v1/tasks/123/complete
  Content-Type: application/json
  {
    "decision": "approve",
    "comments": "Onaylandı"
  }
  ```

## 13. En İyi Uygulamalar
- İş akışlarını basit ve anlaşılır tutun.
- Gereksiz onay adımlarından kaçının.
- Süreç performansını sürekli izleyin.
- Kullanıcı eğitimi yapın.

## 14. Güvenlik ve Yetkilendirme
- Rol bazlı erişim kontrolü uygulanır.
- Süreç verileri şifrelenir.
- Audit log tutulur.

Daha fazla bilgi için sistem yöneticiniz veya destek ekibiyle iletişime geçebilirsiniz. 