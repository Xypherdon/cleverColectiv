App.info({
    id: 'com.example.infoubb.clever',
    name: 'Clever',
    description: 'Clever App',
    author: '732/2',
});

App.appendToConfig(`
    <edit-config file="app/src/main/AndroidManifest.xml" mode="merge" target="/manifest/application" xmlns:android="http://schemas.android.com/apk/res/android">
        <application android:usesCleartextTraffic="true"></application>
    </edit-config>
`);

App.accessRule('http://192.168.100.3:3000/');
App.accessRule('*');
