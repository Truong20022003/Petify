package com.example.petify.data.database

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper

class ChatDatabase(context: Context) :
    SQLiteOpenHelper(context, "chat_database.db", null, 1) {
    val TABLE_NAME = "chat_history"
    val COLUMN_ID = "id"
    val COLUMN_MESSAGE = "message"
    val COLUMN_IS_BOT = "is_bot"
    val COLUMN_TIMESTAMP = "timestamp"
    val COLUMN_CONVERSATION_ID = "conversation_id"


    override fun onCreate(db: SQLiteDatabase) {
        val createTable = "CREATE TABLE $TABLE_NAME (" +
                "$COLUMN_ID INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "$COLUMN_MESSAGE TEXT, " +
                "$COLUMN_IS_BOT INTEGER, " +
                "$COLUMN_TIMESTAMP TEXT, " +
                "$COLUMN_CONVERSATION_ID TEXT)"
        db.execSQL(createTable)
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        db.execSQL("DROP TABLE IF EXISTS $TABLE_NAME")
        onCreate(db)
    }
}