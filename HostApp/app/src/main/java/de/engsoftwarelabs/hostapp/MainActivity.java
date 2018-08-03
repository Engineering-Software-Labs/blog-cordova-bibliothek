package de.engsoftwarelabs.hostapp;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import de.engsoftwarelabs.cordovalib.CordovaLibActivity;

public class MainActivity extends AppCompatActivity {
  static final int LIB_RESULT = 0x1001;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);

    Button startButton = (Button) findViewById(R.id.startButton);
    startButton.setOnClickListener( new View.OnClickListener() {

        @Override
        public void onClick(View v) {
          Intent intent = new Intent(getApplicationContext(), CordovaLibActivity.class);
          startActivityForResult(intent, LIB_RESULT);
        }
      });
  }

  @Override
  protected void onActivityResult(int requestCode, int resultCode, Intent resultData) {
    super.onActivityResult(requestCode, resultCode, resultData);
  }
}
