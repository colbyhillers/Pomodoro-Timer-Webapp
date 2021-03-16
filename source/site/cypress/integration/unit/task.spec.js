/// <reference types="cypress" />


let mock_data = {
  "task_list_data": [
    {
      "id": "1579afed-2143-49e4-8768-b0d54eba43f8",
      "description": "task 1",
      "pomo_estimation": 4,
      "cycles_completed": 0,
    },
    {
      "id": "97bf356c-3910-45f5-950e-34acc6319b83",
      "description": "task 2",
      "pomo_estimation": 2,
      "cycles_completed": 0,
    },
    {
      "id": "98239348-3910-45f5-950e-34acc6319b83",
      "description": "finished task",
      "pomo_estimation_start": 1,
      "pomo_estimation": 3,
      "cycles_completed": 3,
    }
  ],
  "user_log": {
    "last_active": "",
    "timer_state": {
      "current": "timer_init",
      "previous": "timer_during_countdown"
    },
    "current_task": "1579afed-2143-49e4-8768-b0d54eba43f8",
    "break_status": {
      "break": "short_break",
      "cycles": 0
    },
    "log": [
      "1579afed-2143-49e4-8768-b0d54eba43f8",
      "short_break",
    ],
    "online": true
  },
  "settings": {
    "working_sec": 6,
    "short_break_sec": 3,
    "short_break_cycles": 3,
    "long_break_sec": 5,
    "long_break_cycles": 1,
    "allow_emergency_stop": true
  }
}

function edit_btn(idx) { return cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(idx).shadow().find('#pomo-edit-btn'); }
function cycle_input(idx) { return cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(idx).shadow().find('#pomo-counter-edit'); }
function description_input(idx) { return cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(idx).shadow().find('#task-edit'); }
function confirm_btn(idx) { return cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(idx).shadow().find('#pomo-confirm-btn'); }
function cancel_btn(idx) { return cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(idx).shadow().find('#pomo-cancel-btn'); }
function modal_confirm() { return cy.get('#c-modal').shadow().find('.modal').find('.modal-content').find('#confirm-button'); }
function modal_cancel() { return cy.get('#c-modal').shadow().find('.modal').find('.modal-content').find('#cancel-button'); }
function close_modal() {
  return cy.get("#c-modal").shadow().find("#close").click();
}






context('Window', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem('user_data', JSON.stringify(mock_data))
      cy.visit('http://localhost:3000');
      cy.wait(500);
      cy.get('#c-modal').shadow().find('.modal').find('.modal-content').find('.close')
        .click().then(() => {
          cy.get('#tasklist-btn').click();
        });
    })
  })

  it('task.js - test click edit then cancel', () => {
    cy.window().then((win) => {
      edit_btn(0).click();
      cancel_btn(0).click();
    });
  });

  it('task.js - test split tasks', () => {
    cy.window().then((win) => {
      edit_btn(0).click();
      cycle_input(0).clear().type(10, {force: true});
      description_input(0).clear().type('task1', {force: true});
      confirm_btn(0).click();
      modal_confirm().click();
    });
  });


  it('task.js - test negative cycle count', () => {
    cy.window().then((win) => {
      edit_btn(0).click()
      cycle_input(0).clear().type(-1, {force: true});
      confirm_btn(0).click();
      close_modal();
    });
  });

  it('task.js - test invalid cycle count 0', () => {
    cy.window().then((win) => {
      edit_btn(0).click();
      cycle_input(0).clear().type(0, {force: true});
      description_input(0).clear().type('task1', {force: true});
      confirm_btn(0).click();
      close_modal();
    });
  });

  it('task.js - test invalid cycle count -1', () => {
    cy.window().then((win) => {
      edit_btn(0).click();
      cycle_input(0).clear().type(-1, {force: true});
      description_input(0).clear().type('task1', {force: true});
      confirm_btn(0).click();
      close_modal();
    });
  });

  it('task.js - test invalid cycle count 1.5', () => {
    cy.window().then((win) => {
      edit_btn(0).click();
      cycle_input(0).clear().type(1.5, {force: true});
      description_input(0).clear().type('task1', {force: true});
      confirm_btn(0).click();
      close_modal();
    });
  });

  it('task.js - test invalid task description nothing', () => {
    cy.window().then((win) => {
      edit_btn(0).click();
      description_input(0).clear({force: true});
      confirm_btn(0).click();
      close_modal();
    });
  });



  it('task.js - test many cycles but not split input', () => {
    cy.window().then((win) => {
      edit_btn(0).click();
      cycle_input(0).clear().type(11, {force: true});
      description_input(0).clear().type('dd2', {force: true});
      confirm_btn(0).click();
      modal_cancel().click();
    });
  });


  it('task.js - test valid input', () => {
    cy.window().then((win) => {
      edit_btn(0).click();
      cycle_input(0).clear().type(3, {force: true});
      description_input(0).clear().type('dd3', {force: true});
      confirm_btn(0).click();
    });
  });


  it('task.js - test moving task up and down', () => {
    cy.window().then((win) => {
      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(0).shadow()
        .find('#order-btn-up').click();
      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(0).shadow()
        .find('#order-btn-down').click();
      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(0).shadow()
        .find('#pomo-delete-btn').click();
      cy.get('#c-task-list').shadow().find('.side-bar-division').find('c-task').invoke('attr', 'mode_view');
    });
  });

  it('task.js - test delete task', () => {
    cy.window().then((win) => {
      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(0).shadow()
        .find('#pomo-delete-btn').click();
    });
  });

  it('task.js - test cancel task right after add', () => {
    cy.window().then((win) => {
      cy.get('#c-task-list').shadow().find('#add-task-button').click();
      cy.get('#c-task-list').shadow().find('#pending-list').find('c-task').eq(1).shadow()
        .find('#pomo-cancel-btn').click();
    });
  });
})