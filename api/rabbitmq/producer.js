const amqp = require('amqplib');

class RabbitMQProducer {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    try {
      // Connect to RabbitMQ server
      this.connection = await amqp.connect('amqp://localhost:5672');
      this.channel = await this.connection.createChannel();
      
      console.log('Connected to RabbitMQ');
      
      // Handle connection errors
      this.connection.on('error', (err) => {
        console.error('RabbitMQ connection error:', err);
      });

      this.connection.on('close', () => {
        console.log('RabbitMQ connection closed');
      });

    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
      throw error;
    }
  }

  async sendMessage(queueName, message, options = {}) {
    try {
      if (!this.channel) {
        await this.connect();
      }

      // Declare queue (creates if doesn't exist)
      await this.channel.assertQueue(queueName, {
        durable: true, // Queue survives server restarts
        ...options
      });

      // Convert message to buffer
      const messageBuffer = Buffer.from(JSON.stringify(message));

      // Send message to queue
      const sent = this.channel.sendToQueue(queueName, messageBuffer, {
        persistent: true // Message survives server restarts
      });

      if (sent) {
        console.log(`Message sent to queue "${queueName}":`, message);
        return true;
      } else {
        console.log('Message was not sent - queue is full');
        return false;
      }
    } catch (error) {
      console.error('Error sending message to RabbitMQ:', error);
      throw error;
    }
  }

  async sendToExchange(exchangeName, routingKey, message, exchangeType = 'direct') {
    try {
      if (!this.channel) {
        await this.connect();
      }

      // Declare exchange
      await this.channel.assertExchange(exchangeName, exchangeType, {
        durable: true
      });

      // Convert message to buffer
      const messageBuffer = Buffer.from(JSON.stringify(message));

      // Publish message to exchange
      const published = this.channel.publish(exchangeName, routingKey, messageBuffer, {
        persistent: true
      });

      if (published) {
        console.log(`Message published to exchange "${exchangeName}" with routing key "${routingKey}":`, message);
        return true;
      } else {
        console.log('Message was not published');
        return false;
      }
    } catch (error) {
      console.error('Error publishing message to exchange:', error);
      throw error;
    }
  }

  async close() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      console.log('RabbitMQ connection closed');
    } catch (error) {
      console.error('Error closing RabbitMQ connection:', error);
    }
  }
}

module.exports = RabbitMQProducer;