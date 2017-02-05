package com.bignerdranch.android.textflow;

import com.bignerdranch.android.textflow.util.SystemUiHider;

import android.Manifest;
import android.annotation.TargetApi;
import android.app.Activity;
import android.content.pm.PackageManager;
import android.database.ContentObserver;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;

/**
 * An example full-screen activity that shows and hides the system UI (i.e.
 * status bar and navigation/system bar) with user interaction.
 *
 * @see SystemUiHider
 */
public class TextFlowActivity extends Activity
    implements ActivityCompat.OnRequestPermissionsResultCallback {

    /**
     * Whether or not the system UI should be auto-hidden after
     * {@link #AUTO_HIDE_DELAY_MILLIS} milliseconds.
     */
    private static final boolean AUTO_HIDE = true;

    /**
     * If {@link #AUTO_HIDE} is set, the number of milliseconds to wait after
     * user interaction before hiding the system UI.
     */
    private static final int AUTO_HIDE_DELAY_MILLIS = 3000;

    /**
     * If set, will toggle the system UI visibility upon interaction. Otherwise,
     * will show the system UI visibility upon interaction.
     */
    private static final boolean TOGGLE_ON_CLICK = true;

    /**
     * The flags to pass to {@link SystemUiHider#getInstance}.
     */
    private static final int HIDER_FLAGS = SystemUiHider.FLAG_HIDE_NAVIGATION;

    private static int MY_PERMISSIONS_REQUEST_READ_SMS = 0;

    private static String MYTAG = TextFlowActivity.class.getSimpleName();

    /**
     * The instance of the {@link SystemUiHider} for this activity.
     */
    private SystemUiHider mSystemUiHider;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // Can't believe I had to do this just to see stack traces... WTF Google!? :P
        setDefaultUncaughtExceptionHandler();

        // --------------------------------------------------------------------------------
        // BEGIN GENERATED CODE
        // FIXME see if we need the mSystemUiHider BS
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_text_flow);

        final View controlsView = findViewById(R.id.fullscreen_content_controls);
        final View contentView = findViewById(R.id.fullscreen_content);

        // Set up an instance of SystemUiHider to control the system UI for
        // this activity.
        mSystemUiHider = SystemUiHider.getInstance(this, contentView, HIDER_FLAGS);
        mSystemUiHider.setup();
        mSystemUiHider.setOnVisibilityChangeListener(new SystemUiHider.OnVisibilityChangeListener() {
            // Cached values.
            int mControlsHeight;
            int mShortAnimTime;

            @Override
            @TargetApi(Build.VERSION_CODES.HONEYCOMB_MR2)
            public void onVisibilityChange(boolean visible) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB_MR2) {
                    // If the ViewPropertyAnimator API is available
                    // (Honeycomb MR2 and later), use it to animate the
                    // in-layout UI controls at the bottom of the
                    // screen.
                    if (mControlsHeight == 0) {
                        mControlsHeight = controlsView.getHeight();
                    }
                    if (mShortAnimTime == 0) {
                        mShortAnimTime = getResources().getInteger(
                                android.R.integer.config_shortAnimTime);
                    }
                    controlsView.animate()
                            .translationY(visible ? 0 : mControlsHeight)
                            .setDuration(mShortAnimTime);
                } else {
                    // If the ViewPropertyAnimator APIs aren't
                    // available, simply show or hide the in-layout UI
                    // controls.
                    controlsView.setVisibility(visible ? View.VISIBLE : View.GONE);
                }

                if (visible && AUTO_HIDE) {
                    // Schedule a hide().
                    delayedHide(AUTO_HIDE_DELAY_MILLIS);
                }
            }
        });

        // Set up the user interaction to manually show or hide the system UI.
        contentView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (TOGGLE_ON_CLICK) {
                    mSystemUiHider.toggle();
                } else {
                    mSystemUiHider.show();
                }
            }
        });
        // END GENERATED CODE
        // --------------------------------------------------------------------------------


        // --------------------------------------------------------------------------------
        // START REAL SHIT
        // Get all texts and start the SMS listener

        // Get permissions yo. This will kick off the text dump
        initPermissions();
    }


    private static void setDefaultUncaughtExceptionHandler() {
        try {
            Thread.setDefaultUncaughtExceptionHandler(new Thread.UncaughtExceptionHandler() {

                @Override
                public void uncaughtException(Thread t, Throwable e) {
                    Log.e(MYTAG, String.format("Uncaught Exception detected in thread {}", t.getName()), e);
                }
            });
        } catch (SecurityException e) {
            Log.e(MYTAG, "Could not set the Default Uncaught Exception Handler", e);
        }
    }



    @Override
    protected void onPostCreate(Bundle savedInstanceState) {
        super.onPostCreate(savedInstanceState);

        // Trigger the initial hide() shortly after the activity has been
        // created, to briefly hint to the user that UI controls
        // are available.
        delayedHide(100);
    }

    private void initPermissions() {
        Log.d(MYTAG, "initPermissions called");

        // Here, thisActivity is the current activity
        if (ContextCompat.checkSelfPermission(this,
                Manifest.permission.READ_SMS)
                != PackageManager.PERMISSION_GRANTED) {

            // Should we show an explanation?
            if (ActivityCompat.shouldShowRequestPermissionRationale(this,
                    Manifest.permission.READ_SMS)) {

                // Show an explanation to the user *asynchronously* -- don't block
                // this thread waiting for the user's response! After the user
                // sees the explanation, try again to request the permission.

                // FIXME handle this case
                throw new RuntimeException("Can't handle this shit just right now.");

            } else {

                // No explanation needed, we can request the permission.

                Log.d(MYTAG, "Requesting permission");
                ActivityCompat.requestPermissions(this,
                        new String[]{Manifest.permission.READ_SMS},
                        MY_PERMISSIONS_REQUEST_READ_SMS);
            }
        } else {
            Log.d(MYTAG, "Permission already granted.");

            initSmsDump();
        }
    }

    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,
                                           @NonNull int[] grantResults) {
        Log.d(MYTAG, "onRequestPermissionsResult called");

        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        // Is READ_SMS in permissions?
        Integer grantResult = null;
        for (int i = 0; i < permissions.length; ++i) {
            String permission = permissions[i];
            if (permission.equals(Manifest.permission.READ_SMS)) {
                grantResult = grantResults[i];
                break;
            }
        }

        if (grantResult == null) {
            // not the relevant permission
            return;
        }

        if (grantResult == PackageManager.PERMISSION_GRANTED) {
            Log.d(MYTAG, "Got permission to read SMS! :)");

            initSmsDump();
        } else {
            // FIXME show a dialog or some shit
            throw new RuntimeException("Can't really help ya then.");
        }
    }


    void initSmsDump() {
        dumpSms();

        // Init observer
        Log.d(MYTAG, "Registering SMS observer");
        SmsSendObserver myObserver = new SmsSendObserver(new Handler());
        getContentResolver().registerContentObserver(Uri.parse("content://sms/inbox"), true, myObserver);
        getContentResolver().registerContentObserver(Uri.parse("content://sms/sent"), true, myObserver);
        getContentResolver().registerContentObserver(Uri.parse("content://sms/out"), true, myObserver);
    }

    void dumpSms() {
        dumpContent("content://sms/inbox");
        dumpContent("content://sms/sent");
    }

    void dumpContent(String uri) {
        final String[] projection = new String[]{"*"};
        Cursor cursor = getContentResolver().query(Uri.parse(uri), projection,
                null, null, null);

        if (cursor.moveToFirst()) { // must check the result to prevent exception
            do {
                String msgData = "";
                for(int idx=0;idx<cursor.getColumnCount();idx++)
                {
                    msgData += " " + cursor.getColumnName(idx) + ":" + cursor.getString(idx);
                }
                Log.d(MYTAG, msgData);
            } while (cursor.moveToNext());
        } else {
            Log.d(MYTAG, String.format("{} is empty!", uri));
        }
    }


    class SmsSendObserver extends ContentObserver {
        public SmsSendObserver(Handler handler) {
            super(handler);
        }

        @Override
        public void onChange(boolean selfChange) {
            this.onChange(selfChange,null);
        }

        @Override
        public void onChange(boolean selfChange, Uri uri) {
            Log.d(MYTAG, String.format("{} change detected", uri));
        }
    }


    /**
     * Touch listener to use for in-layout UI controls to delay hiding the
     * system UI. This is to prevent the jarring behavior of controls going away
     * while interacting with activity UI.
     */
    View.OnTouchListener mDelayHideTouchListener = new View.OnTouchListener() {
        @Override
        public boolean onTouch(View view, MotionEvent motionEvent) {
            if (AUTO_HIDE) {
                delayedHide(AUTO_HIDE_DELAY_MILLIS);
            }
            return false;
        }
    };

    Handler mHideHandler = new Handler();
    Runnable mHideRunnable = new Runnable() {
        @Override
        public void run() {
            mSystemUiHider.hide();
        }
    };

    /**
     * Schedules a call to hide() in [delay] milliseconds, canceling any
     * previously scheduled calls.
     */
    private void delayedHide(int delayMillis) {
        mHideHandler.removeCallbacks(mHideRunnable);
        mHideHandler.postDelayed(mHideRunnable, delayMillis);
    }
}
