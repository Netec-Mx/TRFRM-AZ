# Práctica 8: Crear archivo `.tfvars` con claves y etiqueta sensible

## Objetivo

Separar los valores de las variables del archivo principal `main.tf` utilizando un archivo `.tfvars` para mejorar la seguridad, organización y reutilización del código.  
Se añadirá una variable sensible para simular una clave privada y se demostrará cómo ocultarla en la salida usando `sensitive = true`.

## Requisitos Previos

- Haber completado las prácticas anteriores (especialmente la 4 y 5).
- Tener la carpeta `TERRALABS` con el archivo `main.tf` funcional.
- Tener recursos definidos: `azurerm_resource_group`, `azurerm_virtual_network`, `azurerm_container_group`.

---

## Instrucciones

### Tarea 1. Declarar nuevas variables en `main.tf`

> Se añadirán definiciones de variables que serán cargadas desde el archivo `.tfvars`.

#### Tarea 1.1. Abrir y modificar `main.tf`

- **Paso 1.** Abre el archivo `main.tf` en Visual Studio Code.

- **Paso 2.** Añade las siguientes variables al inicio (sustituyendo tambien la variable `initials`):

  ```hcl
  variable "initials" {
    description = "Iniciales del estudiante"
    type        = string
  } 
  variable "env" {
    description = "Entorno de despliegue (dev, test, prod)"
    type        = string
  }

  variable "custom_tag" {
    description = "Etiqueta personalizada para los recursos"
    type        = string
  }

  variable "secreto_api" {
    description = "Simulación de una clave sensible"
    type        = string
    sensitive   = true
  }
  ```
  ---
  ![terraimg37](/TRFRM-AZ/images/lab8/img1.png)

#### Tarea 1.2. Reorganizar valores en `locals`

- **Paso 1.** Asegúrate de tener este bloque:
  
  **NOTA:** Si ya lo tienes avanza a la siguiente tarea.

  ```hcl
  locals {
    location             = "East US"
    resource_group_name  = "rg-vnet-${var.initials}"
    vnet_name            = "vnet-${var.initials}"
    aci_name             = "aci-${var.initials}"
    aci_dns_label        = "acilab-${lower(var.initials)}"
  }
  ```

> **TAREA FINALIZADA**

**Resultado esperado:** Todas las variables necesarias están declaradas para ser usadas con `.tfvars`.

---

### Tarea 2. Crear y configurar el archivo `terraform.tfvars`

> Este archivo contendrá los valores de las variables anteriores, incluidas las sensibles.

#### Tarea 2.1. Crear `terraform.tfvars` en `TERRALABS`

- **Paso 1.** Dentro de la carpeta `TERRALABS` crea un archivo llamado `terraform.tfvars`

  ![terraimg38](/TRFRM-AZ/images/lab8/img2.png)

- **Paso 2.** Copia y pega el siguiente bloque de codigo en el archivo `terraform.tfvars`.

  **NOTA:** Sustituye las letras `x` por tus iniciales.

  ```hcl
  initials     = "xxx"
  env          = "dev"
  custom_tag   = "Terraform_Azure_Lab"
  secreto_api  = "ClaveSuperPrivada123!"
  ```
  ---
  ![terraimg39](/TRFRM-AZ/images/lab8/img3.png)

> **TAREA FINALIZADA**

**Resultado esperado:** El archivo `.tfvars` define todos los valores necesarios y permite cargar configuraciones dinámicamente.

---

### Tarea 3. Usar las variables y proteger la clave secreta

> Se utilizarán las variables en etiquetas, y se agregará un output sensible para verificar el uso de claves privadas.

#### Tarea 3.1. Usar variables en los recursos

- **Paso 1.** En cada recurso (`resource_group`, `vnet`, `container_group`) asegúrate de incluir:

  ```hcl
  tags = {
    environment = var.env
    proyecto    = var.custom_tag
  }
  ```
  ---
  ![terraimg40](/TRFRM-AZ/images/lab8/img4.png)
  ---
  ![terraimg41](/TRFRM-AZ/images/lab8/img5.png)
  ---
  ![terraimg41](/TRFRM-AZ/images/lab8/img6.png)

#### Tarea 3.2. Crear output sensible

- **Paso 1.** Al final de `main.tf`, agrega:

  ```hcl
  output "clave_api" {
    description = "Este valor es sensible y no debe mostrarse en CLI"
    value       = var.secreto_api
    sensitive   = true
  }
  ```
  ---
  ![terraimg42](/TRFRM-AZ/images/lab8/img7.png)

- **Paso 2.** Ahora ejecuta el siguiente comando para probar.

  ```hcl
  terraform apply -auto-approve
  ```

  **NOTA:** Si ya tienes la infraestructura creada puedes usar `terraform plan`

- **Paso 3.** Ya sea con un `plan` o un `apply` observa las etiquetas de cada recurso en la salida y la etiqueta sensible.

  ![terraimg43](/TRFRM-AZ/images/lab8/img8.png)

> **TAREA FINALIZADA**

**Resultado esperado:** Las etiquetas están personalizadas y la variable sensible protegida en la salida.

---

> **¡FELICIDADES HAZ COMPLETADO EL LABORAOTRIO 8!**

## Resultado Final

- `main.tf` define todas las variables requeridas.
- `terraform.tfvars` contiene los valores para el entorno, iniciales y clave secreta.
- Al ejecutar `terraform apply`, la salida de la clave estará oculta (`<sensitive>`).
- Los recursos tienen etiquetas dinámicas como `"environment = dev"` y `"proyecto = Terraform_Azure_Lab"`.

---

## Notas

- Terraform carga automáticamente `terraform.tfvars`, no es necesario usar `-var-file`.
- Para visualizar los outputs sin mostrar la clave:

  ```bash
  terraform output
  ```

- Para confirmar que es sensible:

  ```bash
  terraform output clave_api
  # Salida: <sensitive>
  ```

- No subas `terraform.tfvars` a un repositorio. Agrega esto a `.gitignore`:

  ```
  terraform.tfvars
  ```