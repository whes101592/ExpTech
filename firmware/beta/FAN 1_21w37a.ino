#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <ESP8266HTTPUpdateServer.h>
#include <EEPROM.h>
#include "FirebaseESP8266.h"

#define FIREBASE_HOST "https://exptech-c6084-default-rtdb.asia-southeast1.firebasedatabase.app/" //Firebase RTDB 資料庫

FirebaseData firebaseData1;
FirebaseData firebaseData2;

String path = "/Data";
const char* host = "ExpTech-FAN1";
String model = "FAN 1";
String ver = "21w37a";
String esid = "";
String epass = "";
String APpass = "12345678";
String inform = "";
String AUTH = "";
int TRY = 0;

ESP8266WebServer httpServer(80);
WiFiServer server(1015);
ESP8266HTTPUpdateServer httpUpdater;

//初始化
void setup(void) {
  EEPROM.begin(512);
  eepromread();
  pinMode(D5, OUTPUT);
  pinMode(0, INPUT_PULLUP);
  Serial.begin(115200);
  WiFi.mode(WIFI_AP_STA);
  WiFi.softAP("ExpTech-FAN1",APpass);
  if (esid != "" && epass != "") {
    WiFi.begin(esid, epass);
  }
  MDNS.begin(host);
  httpUpdater.setup(&httpServer);
  httpServer.begin();
  server.begin();
  MDNS.addService("http", "tcp", 80);
}

//EEPROM_Wi-Fi
void eepromread() {
  for (int i = 0; i < 32; ++i)
  {
    esid += char(EEPROM.read(i));
  }
  for (int i = 32; i < 96; ++i)
  {
    epass += char(EEPROM.read(i));
  }
  for (int i = 96; i < 160; ++i)
  {
    APpass += char(EEPROM.read(i));
  }
}

//資訊串
void informcall() {
  inform = "{\"Version\":\"" + ver + "\",\"Model\":\"" + model + "\",\"SketchMD5\":\"" + ESP.getSketchMD5() + "\",\"SketchMD5\":\"" + ESP.getSketchMD5() + "\",\"version\":\"" + ver + "\",\"ResetReason\":\"" + ESP.getResetReason() + "\",\"FreeHeap\":\"" + ESP.getFreeHeap() + "\",\"HeapFragmentation\":\"" + ESP.getHeapFragmentation() + "\",\"MaxFreeBlockSize\":\"" + ESP.getMaxFreeBlockSize() + "\",\"ChipId\":\"" + ESP.getChipId() + "\",\"CoreVersion\":\"" + ESP.getCoreVersion() + "\",\"SdkVersion\":\"" + ESP.getSdkVersion() + "\",\"CpuFreqMHz\":\"" + ESP.getCpuFreqMHz() + "\",\"SketchSize\":\"" + ESP.getSketchSize() + "\",\"FreeSketchSpace\":\"" + ESP.getFreeSketchSpace() + "\",\"FlashChipId\":\"" + ESP.getFlashChipId() + "\",\"FlashChipSize\":\"" + ESP.getFlashChipSize() + "\",\"FlashChipRealSize\":\"" + ESP.getFlashChipRealSize() + "\",\"FlashChipSpeed\":\"" + ESP.getFlashChipSpeed() + "\",\"CycleCount\":\"" + ESP.getCycleCount() + "\",\"localIP\":\"" + WiFi.localIP().toString() + "\"}";
}

//Wi,Fi直連數據處理
void wifiIn(){
  WiFiClient client = server.available();
  if (client) {
    while (client.connected()) {
      if (client.available()) {
        String line = client.readStringUntil('\r');
        if ( line.indexOf("eeprom-fix") > 0 )  {
          for (int i = 0; i < 513; ++i)
          {
            EEPROM.write(i, 0);
          }
          EEPROM.commit();
          client.println(
            String("HTTP/1.1 200 OK\r\n") +
            "Content-Type: text/html\r\n" +
            "Connection: close\r\n" +
            "\r\n" +
            "<!DOCTYPE html> <html>\n" +
            "</head>\n" +
            "<body>\n" +
            "SUCCESS" +
            "</html>" +
            "\r\n"
          );
          break;
        } else if ( line.indexOf("eeprom-read") > 0 )  {
          String eepromread = "";
          for (int i = 0; i < 512; ++i)
          {
            eepromread += char(EEPROM.read(i));
          }
          client.println(
            String("HTTP/1.1 200 OK\r\n") +
            "Content-Type: text/html\r\n" +
            "Connection: close\r\n" +
            "\r\n" +
            "<!DOCTYPE html> <html>\n" +
            "</head>\n" +
            "<body>\n" +
            eepromread +
            "</html>" +
            "\r\n"
          );
          break;
        } else if ( line.indexOf("eeprom-wifi") > 0 )  {
          esid = "";
          epass = "";
          eepromread();
          client.println(
            String("HTTP/1.1 200 OK\r\n") +
            "Content-Type: text/html\r\n" +
            "Connection: close\r\n" +
            "\r\n" +
            "<!DOCTYPE html> <html>\n" +
            "</head>\n" +
            "<body>\n" +
            "{\"SSID\":\"" + esid + "\"-\"PASSWORD\":\"" + epass + "\"}" +
            "</html>" +
            "\r\n"
          );
          break;
        } else if ( line.indexOf("SSID") > 0 )  {
          String qsid = line.substring(line.indexOf("SSID=") + 5, line.indexOf(";"));
          qsid.replace("%20", " ");
          for (int i = 0; i < qsid.length(); ++i)
          {
            EEPROM.write(i, qsid[i]);
          }
          EEPROM.commit();
          esid=qsid;
          client.println(
            String("HTTP/1.1 200 OK\r\n") +
            "Content-Type: text/html\r\n" +
            "Connection: close\r\n" +
            "\r\n" +
            "<!DOCTYPE html> <html>\n" +
            "</head>\n" +
            "<body>\n" +
            "SUCCESS" +
            "</html>" +
            "\r\n"
          );
          break;
        } else if ( line.indexOf("PASSWORD") > 0 ) {
          String qpass = line.substring(line.indexOf("PASSWORD=") + 9, line.indexOf(";"));
          for (int i = 0; i < qpass.length(); ++i)
          {
            EEPROM.write(32 + i, qpass[i]);
          }
          EEPROM.commit();
          epass=qpass;
          client.println(
            String("HTTP/1.1 200 OK\r\n") +
            "Content-Type: text/html\r\n" +
            "Connection: close\r\n" +
            "\r\n" +
            "<!DOCTYPE html> <html>\n" +
            "</head>\n" +
            "<body>\n" +
            "SUCCESS" +
            "</html>" +
            "\r\n"
          );
          break;
        } else if ( line.indexOf("RST") > 0 ) {
          ESP.restart();
        } else if ( line.indexOf("inform") > 0 )  {
          client.println(
            String("HTTP/1.1 200 OK\r\n") +
            "Content-Type: text/html\r\n" +
            "Connection: close\r\n" +
            "\r\n" +
            "<!DOCTYPE html> <html>\n" +
            "</head>\n" +
            "<body>\n" +
            inform +
            "</html>" +
            "\r\n"
          );
          break;
        } else if ( line.indexOf("PWM") > 0 ) {
          analogWrite(D5, line.substring(line.indexOf("PWM=") + 4, line.indexOf(";")).toInt());
          client.println(
            String("HTTP/1.1 200 OK\r\n") +
            "Content-Type: text/html\r\n" +
            "Connection: close\r\n" +
            "\r\n" +
            "<!DOCTYPE html> <html>\n" +
            "</head>\n" +
            "<body>\n" +
            "SUCCESS" +
            "</html>" +
            "\r\n"
          );
          break;
        }else if ( line.indexOf("RTDB") > 0 )  {
          String AUTH = line.substring(line.indexOf("RTDB=") + 5, line.indexOf(";"));    
          client.println(
            String("HTTP/1.1 200 OK\r\n") +
            "Content-Type: text/html\r\n" +
            "Connection: close\r\n" +
            "\r\n" +
            "<!DOCTYPE html> <html>\n" +
            "</head>\n" +
            "<body>\n" +
            "SUCCESS" +
            "</html>" +
            "\r\n"
          );
          break;
        }else if ( line.indexOf("AP") > 0 ) {
          String APpass = line.substring(line.indexOf("AP=") + 3, line.indexOf(";"));
          for (int i = 0; i < APpass.length(); ++i)
          {
            EEPROM.write(96 + i, APpass[i]);
          }
          EEPROM.commit();
          client.println(
            String("HTTP/1.1 200 OK\r\n") +
            "Content-Type: text/html\r\n" +
            "Connection: close\r\n" +
            "\r\n" +
            "<!DOCTYPE html> <html>\n" +
            "</head>\n" +
            "<body>\n" +
            "SUCCESS" +
            "</html>" +
            "\r\n"
          );
          break;
        }
      }
    }
    delay(1);
    client.flush();
  }
}

//Wi-Fi連線嘗試
void wificonnect(){
  if(TRY>5000){
    if (esid != "" && epass != "") {
      WiFi.begin(esid, epass);
    }
  TRY=0;
  }else{
    TRY=TRY+1;
  }
}

void OTA(){
  httpServer.handleClient();
  MDNS.update();
}

void loop(void) {
  informcall();
  OTA();
  if(digitalRead(0)==LOW){
     for (int i = 0; i < 513; ++i)
          {
            EEPROM.write(i, 0);
          }
          EEPROM.commit();
          ESP.restart();
  }
  if (WiFi.waitForConnectResult() != WL_CONNECTED) {
  wificonnect();
  }
  wifiIn();
 
  if (AUTH != "") {
    Firebase.begin(FIREBASE_HOST, AUTH);
    Firebase.reconnectWiFi(true);
    if (!Firebase.beginStream(firebaseData1, path + "/authorization"))
    {

    }
    Firebase.setString(firebaseData2, path + "/" + String(ESP.getChipId()), inform);
  }
  
}
